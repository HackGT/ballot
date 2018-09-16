import { Logger } from '../util/Logger';
import { printAndThrowError } from '../util/common';
import { BallotModel, BallotStatus, Ballots, BallotInstance } from '../models/BallotModel';
import { sequelize } from '../db';
import { ProjectModelWithoutCategories, ProjectModel } from '../models/ProjectModel';
import { dataStore } from '../store/DataStore';
import { io } from '../app';

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
    public static projects: { [projectID: number]: ProjectModelWithoutCategories } = {};
    public static projectBallotCounts: { [projectID: number]: number } = {};

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

    public static async getNextProject(userID: number):
        Promise<{
            project: ProjectModel,
            ballots: Array<(BallotModel | BallotInstance)>
        } | undefined> {
        if (dataStore.judgeQueues[userID].activeProjectID) {
            // If there is still an active ASSIGNED project, give this project.
            const activeProjectID = dataStore.judgeQueues[userID].activeProjectID!;

            // Get ballots for the current project.
            const ballotIDs: number[] = dataStore.usersToProjects[userID][activeProjectID];

            // Retrieve BallotModels for this project.
            const resultBallots: BallotModel[] = [];
            for (const ballotID of ballotIDs) {
                resultBallots.push(dataStore.ballots[ballotID]);
            }

            // Return project and associated ballots.
            return {
                project: dataStore.projects[activeProjectID],
                ballots: resultBallots,
            };

        } else if (dataStore.judgeQueues[userID].queuedProjectID) {
            // If there is a queued project, push this project into active ASSIGNED.
            const activeProjectID = dataStore.judgeQueues[userID].queuedProjectID!;

            // Move project from queued to assigned.
            dataStore.judgeQueues[userID].activeProjectID = activeProjectID;
            dataStore.judgeQueues[userID].queuedProjectID = null;

            // Get ballotIDs for this project.
            const ballotIDs: number[] = dataStore.usersToProjects[userID][activeProjectID!];

            // Retrieve BallotModels for this project and set status to assigned.
            const resultBallots: BallotModel[] = [];
            for (const ballotID of ballotIDs) {
                dataStore.ballots[ballotID].ballot_status = BallotStatus.Assigned;
                resultBallots.push(dataStore.ballots[ballotID]);
            }

            // Update ballots table in database with new status.
            await Ballots.update({
                ballot_status: BallotStatus.Assigned,
            }, {
                where: {
                    user_id: userID,
                    project_id: activeProjectID,
                },
            });

            // Broadcast that project has moved from queued to assigned.
            io.to('authenticated').emit('next_project', {
                userID,
                projectID: activeProjectID,
            });

            // Return ProjectModel and ballots to resolver.
            return {
                project: dataStore.projects[activeProjectID],
                ballots: resultBallots,
            };
        }

        // If the judge has no projects in his queue, return nothing.
        return undefined;
    }

    public static async startProject(userID: number, projectID: number): Promise<boolean> {
        // Make sure the judge is currently assigned a project. If not, return false.
        if (dataStore.judgeQueues[userID].activeProjectID) {
            // Make sure ballots exist for this project.
            if (dataStore.usersToProjects[userID][projectID]) {
                for (const ballotID of dataStore.usersToProjects[userID][projectID]) {
                    dataStore.ballots[ballotID].ballot_status = BallotStatus.Started;
                }

                await Ballots.update({
                    ballot_status: BallotStatus.Started,
                }, {
                    where: {
                        user_id: userID,
                        project_id: projectID,
                    },
                });

                io.to('authenticated').emit('start_project', {
                    message: `Judge ${userID} started judging project ${dataStore.judgeQueues[userID].activeProjectID}`,
                    userID,
                    projectID,
                });

                return true;
            }

        }

        return false;
    }

    public static async skipProject(userID: number, projectID: number): Promise<boolean> {
        const activeProjectID = dataStore.judgeQueues[userID].activeProjectID;
        // If there is not an assigned project, return nothing.
        if (activeProjectID === projectID) {
            // Get ballotIDs for this project.
            const ballotIDs: number[] = dataStore.usersToProjects[userID][activeProjectID!];

            // Retrieve BallotModels for this project and set status to skipped.
            const resultBallots: BallotModel[] = [];
            for (const ballotID of ballotIDs) {
                dataStore.ballots[ballotID].ballot_status = BallotStatus.Skipped;
                resultBallots.push(dataStore.ballots[ballotID]);
            }

            // Update ballots table in database with new status.
            Ballots.update({
                ballot_status: BallotStatus.Skipped,
            }, {
                where: {
                    user_id: userID,
                    project_id: projectID,
                },
            });

            // Remove the project from the queue.
            dataStore.judgeQueues[userID].activeProjectID = null;

            // Add the project to the judge's judged projects.
            dataStore.judgedProjects[userID].push(activeProjectID);

            // Broadcast socket
            io.to('authenticated').emit('skip_project', {
                userID,
                projectID,
            });

            return true;
        }

        return false;
    }

    /*
     * Applies the ballot scores and moves onto the next projects
     */
    public static async scoreProject(userID: number, projectID: number, scores: ProjectScores[]):
        Promise<boolean> {

        if (projectID === dataStore.judgeQueues[userID].activeProjectID) {
            const ballotIDs = dataStore.usersToProjects[userID][projectID];
            const databaseBallots = await Ballots.findAll({
                where: {
                    ballot_id: {
                        [sequelize.Op.or]: ballotIDs,
                    },
                },
            });

            const ballotIDToScores: { [ballotID: number]: number } = {};

            for (const score of scores) {
                ballotIDToScores[score.ballotId] = score.score;
            }

            const socketReturn: BallotModel[] = [];

            for (const databaseBallot of databaseBallots) {
                const ballotID: number = databaseBallot.get('ballot_id');
                databaseBallot.set('score', ballotIDToScores[ballotID]);
                databaseBallot.set('ballot_status', BallotStatus.Submitted);

                databaseBallot.save();

                dataStore.ballots[ballotID].score = ballotIDToScores[ballotID];
                dataStore.ballots[ballotID].ballot_status = BallotStatus.Submitted;

                socketReturn.push(dataStore.ballots[ballotID]);
            }

            if (!dataStore.judgedProjects[userID]) {
                dataStore.judgedProjects[userID] = [];
            }

            dataStore.judgedProjects[userID].push(projectID);
            dataStore.judgeQueues[userID].activeProjectID = null;

            // Broadcast socket
            io.to('authenticated').emit('score_project', {
                userID,
                projectID,
                ballots: socketReturn,
            });

            return true;
        }

        return false;

        // Write the scores for each ballot
        // let projectId: number | undefined;
        // let priority: number;
        // for (const ballot of curBallots) {

        //     const id: number = ballot.get('ballot_id');

        //     if (projectId && projectId !== ballot.get('project_id')) {
        //         logger.error(`Ballot ${id} does not match the others
        //         (project ${projectId} !== ${ballot.get('project_id')})`);
        //     }
        //     projectId = ballot.get('project_id');
        //     priority = ballot.get('judge_priority');

        //     ballot.set('score', scoreDict[id]);
        //     ballot.set('ballot_status', BallotStatus.Submitted);
        //     ballot.save();
        // }
        // // Increment ballot count for projectID
        // this.projectBallotCounts[projectId!]++;
    }
}
