import { Logger } from '../util/Logger';
import { printAndThrowError } from '../util/common';
import { BallotModel, BallotStatus, Ballots, BallotInstance } from '../models/BallotModel';
import { sequelize } from '../db';
import * as BPromise from 'bluebird';

const logger = Logger('controllers/BallotService');

export interface BatchProjectAssignments {
    judge_id: number;
    projects: Array<{ category_id: number, project_id: number }>;
}

interface ProjectScores {
    ballotId: number;
    score: number;
}

export interface Ranking {
    criteria_id: string;
    criteria_name: string;
    category_id: string;
    category_name: string;
    ranking: [{
        name: string;
        project_id: string;
        score: number;
        judge_count: number;
        devpost_id: string;
    }];
}

export class BallotService {

    public static async getRanking(): Promise<Ranking[]> {
        const avgScores = await sequelize.query(
            `SELECT a.name AS project_name, a.project_id, c.name AS
                criteria_name, c.criteria_id, d.name AS category_name,
                d.category_id, AVG(b.score), COUNT(b.score), a.devpost_id
            FROM projects AS a
            INNER JOIN ballots AS b ON a.project_id = b.project_id
                AND b.ballot_status = 'Submitted'
            INNER JOIN criteria AS c ON b.criteria_id = c.criteria_id
            INNER JOIN categories AS d ON c.category_id = d.category_id
            GROUP BY a.project_id, c.criteria_id, d.name, d.category_id
            ORDER BY d.category_id, AVG(b.score);
            `, {
                type: sequelize.QueryTypes.SELECT,
            });

        const criteria: {[key: string]: Ranking} = {};
        for (const row of avgScores) {
            if (row.criteria_id in criteria) {
                criteria[row.criteria_id].ranking.push({
                    name: row.project_name,
                    project_id: row.project_id,
                    score: parseInt(row.avg, 10),
                    judge_count: parseInt(row.count, 10),
                    devpost_id: row.devpost_id,
                });
            } else {
                criteria[row.criteria_id] = {
                    criteria_name: row.criteria_name,
                    criteria_id: row.criteria_id,
                    category_id: row.category_id,
                    category_name: row.category_name,
                    ranking: [{
                        name: row.project_name,
                        project_id: row.project_id,
                        score: parseInt(row.avg, 10),
                        judge_count: parseInt(row.count, 10),
                        devpost_id: row.devpost_id,
                    }],
                };
            }
        }

        return Object.values(criteria);
    }

    public static async batchCreate(assignments: BatchProjectAssignments[]):
        Promise<void> {

        /* Retrieve a list of project IDs to look up */
        const projectIDs = new Set();
        for (const assignment of assignments) {
            for (const project of assignment.projects) {
                projectIDs.add(project.project_id);
            }
        }

        /* Build a dictionary from projectID to list of criteriaIDs */
        const projectCriteriaPairs:
            Array<{ criteria_id: number, project_id: number }> =
            await sequelize.query(
                `SELECT b.project_id, c.criteria_id FROM
            categories AS a
            INNER JOIN project_categories AS b ON
                a.category_id = b.category_id AND b.project_id IN(:projects)
            INNER JOIN criteria AS c ON a.category_id = c.category_id`,
                {
                    replacements: { projects: Array.from(projectIDs) },
                    type: sequelize.QueryTypes.SELECT,
                });

        const criteriaGroups: { [projectId: number]: number[] } = {};
        for (const pair of projectCriteriaPairs) {
            if (pair.project_id in criteriaGroups) {
                criteriaGroups[pair.project_id].push(pair.criteria_id);
            } else {
                criteriaGroups[pair.project_id] = [pair.criteria_id];
            }
        }

        /* Build body for batchCreate */
        const ballotObjs: BallotModel[] = [];

        for (const assignment of assignments) {
            for (let i = 0; i < assignment.projects.length; i++) {
                const project = assignment.projects[i];
                for (const criteriaId of criteriaGroups[project.project_id]) {
                    ballotObjs.push({
                        project_id: project.project_id,
                        user_id: assignment.judge_id,
                        criteria_id: criteriaId,
                        judge_priority: i,
                        ballot_status: i === 0 ? BallotStatus.Assigned :
                            BallotStatus.Pending,
                    });
                }
            }
        }

        await Ballots.bulkCreate(ballotObjs)
            .catch(printAndThrowError('batchCreate', logger));
    }

    public static getNextProject(userId: number, asJson: boolean = true):
        BPromise<Array<(BallotModel | BallotInstance)>> {
        // TODO: Make this a Project that includes ballots
        return Ballots.findAll({
            where: {
                user_id: userId,
                ballot_status: BallotStatus.Assigned,
            },
        })
            .then((ballots) => ballots.map((ballot) => asJson ?
                ballot.toJSON() : ballot))
            .catch(printAndThrowError('getNextProject', logger));
    }

    public static async skipProject(userId: number):
        Promise<BallotModel[] | undefined> {
        // Fetch the ballots currently assigned to the judge
        const curBallots = await
            this.getNextProject(userId, false) as BallotInstance[];

        // Write the scores for each ballot
        let projectId: number | undefined;
        let priority: number;
        for (const ballot of curBallots) {

            const id: number = ballot.get('ballot_id');

            if (projectId && projectId !== ballot.get('project_id')) {
                logger.error(`Ballot ${id} does not match the others
                (project ${projectId} !== ${ballot.get('project_id')})`);
            }
            projectId = ballot.get('project_id');
            priority = ballot.get('judge_priority');

            ballot.set('ballot_status', BallotStatus.Skipped);
            ballot.save();
        }

        // Assign the next round of ballots
        // TODO: Return a Project that includes ballots
        return await Ballots.update(
            { ballot_status: BallotStatus.Assigned } as any, {
                where: { judge_priority: 1 + priority!, user_id: userId },
                returning: true,
            })
            .then((val) => {
                const [num, newBallots] = val;
                if (num === 0) {
                    logger.info('No more ballots to assign.');
                    return undefined;
                }
                return newBallots.map((ballot) => ballot.toJSON());
            })
            .catch(printAndThrowError('scoreProject', logger));
    }

    /*
     * Applies the ballot scores and moves onto the next projects
     */
    public static async scoreProject(userId: number,
                                     ballots: ProjectScores[]):
        Promise<BallotModel[] | undefined> {

        // Build a dictionary to make things easier
        const scoreDict: { [ballotId: number]: number; } = {};
        for (const ballot of ballots) {
            scoreDict[ballot.ballotId] = ballot.score;
        }

        // Fetch the ballots currently assigned to the judge
        const curBallots = await
            this.getNextProject(userId, false) as BallotInstance[];

        if (ballots.length !== curBallots.length) {
            throw new Error('The number of scores entered does not match'
                + ' the number of assigned ballots');
        } else if (curBallots.length === 0) {
            return undefined;
        }

        // Write the scores for each ballot
        let projectId: number | undefined;
        let priority: number;
        for (const ballot of curBallots) {

            const id: number = ballot.get('ballot_id');

            if (projectId && projectId !== ballot.get('project_id')) {
                logger.error(`Ballot ${id} does not match the others
                (project ${projectId} !== ${ballot.get('project_id')})`);
            }
            projectId = ballot.get('project_id');
            priority = ballot.get('judge_priority');

            ballot.set('score', scoreDict[id]);
            ballot.set('ballot_status', BallotStatus.Submitted);
            ballot.save();
        }

        // Assign the next round of ballots
        // TODO: Return a Project that includes ballots
        return await Ballots.update(
            { ballot_status: BallotStatus.Assigned } as any, {
                where: { judge_priority: 1 + priority!, user_id: userId },
                returning: true,
            })
            .then((val) => {
                const [num, newBallots] = val;
                if (num === 0) {
                    logger.info('No more ballots to assign.');
                    return undefined;
                }
                return newBallots.map((ballot) => ballot.toJSON());
            })
            .catch(printAndThrowError('scoreProject', logger));
    }
}
