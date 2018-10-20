import { BallotModel, Ballots, BallotStatus } from '../models/BallotModel';
import { CategoryModel, Categories } from '../models//CategoryModel';
import { ProjectModel, Projects } from '../models//ProjectModel';
import { CriteriaModel, Criteria } from '../models//CriteriaModel';
import { Users, SafeUserModel, UserModel } from '../models//UserModel';
import * as fs from 'fs';
import { sequelize } from '../db';

export class DataStore {
    // Database state
    public ballots: { [ballotID: number]: BallotModel };
    public categories: { [categoryID: number]: CategoryModel };
    public criteria: { [criteriaID: number]: CriteriaModel };
    public projects: { [projectID: number]: ProjectModel };
    public users: { [userID: number]: SafeUserModel };

    // Other state
    public judgeQueues: { [judgeID: number]: {
        activeProjectID: number | null;
        queuedProjectID: number | null;
    } }; // Tim wants with project IDs

    public judgedProjects: { [judgeID: number]: number[] };
    public usersToProjects: { [judgeID: number]: { [projectID: number]: number[] } };
    // public projectsToBallots: { [projectID: number]: number[] };

    public autoassignEnabled: boolean;

    constructor() {
        this.ballots = {};
        this.categories = {};
        this.criteria = {};
        this.projects = {};
        this.users = {};

        this.judgeQueues = {};
        this.judgedProjects = {};
        this.usersToProjects = {};

        this.autoassignEnabled = false;
    }

    public async queueProject(userID: number, projectID: number): Promise<{ status: boolean, message: string }> {
        // Check if this user has a queue, if not, create it.
        if (this.users[userID]) {
            if (!this.judgeQueues[userID]) {
                this.judgeQueues[userID] = {
                    activeProjectID: null,
                    queuedProjectID: null,
                };
            }

            // Check if this judge has any logged judged projects, otherwise, create the log.
            if (!this.judgedProjects[userID]) {
                this.judgedProjects[userID] = [];
            }

            if (!this.usersToProjects[userID]) {
                this.usersToProjects[userID] = {};
            }

            // Check if the judge already judged this project.
            if (this.judgedProjects[userID].includes(projectID)) {
                return {
                    status: false,
                    message: 'Project was already scored by this judge',
                };
            }

            // If the project is currently in the queue, do nothing.
            if (this.judgeQueues[userID].queuedProjectID !== projectID
                && this.judgeQueues[userID].activeProjectID !== projectID) {
                // Check if there is already a queued project. If so, remove the project.
                if (this.judgeQueues[userID].queuedProjectID) {
                    const dequeueResult = await this.dequeueProject(userID, this.judgeQueues[userID].queuedProjectID!);
                    if (!dequeueResult.status) {
                        return dequeueResult;
                    }
                }

                this.judgeQueues[userID].queuedProjectID = projectID;

                const newBallots: BallotModel[] = [];

                for (const category of this.projects[projectID].categories) {
                    for (const criteria of this.categories[category.category_id!].criteria) {
                        newBallots.push({
                            project_id: projectID,
                            user_id: userID,
                            criteria_id: criteria.criteria_id!,
                            judge_priority: 1,
                            ballot_status: BallotStatus.Pending,
                        });
                    }
                }

                const createdBallots = await Ballots.bulkCreate(newBallots, { returning: true });

                const ballotIDs: number[] = [];

                for (const ballot of createdBallots) {
                    const json = ballot.toJSON();
                    this.ballots[json.ballot_id!] = json;
                    ballotIDs.push(json.ballot_id!);
                }

                this.usersToProjects[userID][projectID] = ballotIDs;

                // console.log(this.judgeQueues);

                return {
                    status: true,
                    message: 'Project sucessfully queued',
                };
            }

            return {
                status: false,
                message: 'Project already queued',
            };
        }

        return {
            status: false,
            message: 'User does not exist',
        };
    }

    public async dequeueProject(userID: number, projectID: number): Promise<{status: boolean, message: string}> {
        if (this.users[userID] && this.judgeQueues[userID] && this.judgeQueues[userID].queuedProjectID) {
            if (this.judgeQueues[userID].queuedProjectID === projectID) {
                const ballotIDsToDelete: number[] = [];
                for (const ballot of Object.values(dataStore.ballots)) {
                    if (ballot.project_id === projectID && ballot.user_id === userID) {
                        ballotIDsToDelete.push(ballot.ballot_id!);
                    }
                }

                await Ballots.destroy({
                    where: {
                        ballot_id: {
                            [sequelize.Op.or]: ballotIDsToDelete,
                        },
                    },
                });

                for (const ballotID of ballotIDsToDelete) {
                    delete dataStore.ballots[ballotID];
                }

                delete dataStore.usersToProjects[userID][projectID];

                return {
                    status: true,
                    message: 'Project successfully removed from queue.',
                };
            } else {
                return {
                    status: false,
                    message: 'Inconsistency detected: Queued project does not match input.',
                };
            }
        } else {
            return {
                status: false,
                message: 'No project is queued.',
            };
        }

    }

    public async fetchProjects(): Promise<void> {
        const projectsResult = await Projects.findAll({
            include: [{ model: Categories }],
        });
        for (const project of projectsResult) {
            this.projects[project.toJSON().project_id!] = {
                ...project.toJSON(),
                categories: project.categories!.map((category) => this.categories[category.toJSON().category_id!]),
            };
        }

        // console.log(this.usersToProjects);
    }

    public async fetchCollective(): Promise<void> {
        await this.fetchUsers();
        await this.fetchBallots();
        await this.fetchCategories();

        const criteriaResult = await Criteria.findAll();
        for (const criteria of criteriaResult) {
            const criteriaModel = criteria.toJSON();
            this.criteria[criteriaModel.criteria_id!] = criteriaModel;
            this.categories[criteriaModel.category_id].criteria.push(criteriaModel);
        }

        await this.fetchProjects();
    }

    public async fetchCategories(): Promise<void> {
        const categoryResult = await Categories.findAll();
        for (const category of categoryResult) {
            this.categories[category.toJSON().category_id!] = {
                ...category.toJSON(),
                criteria: [],
            };
        }
    }

    public initializeUser(user: UserModel): void {
        dataStore.users[user.user_id!] = user;
        dataStore.judgedProjects[user.user_id!] = [];
        dataStore.usersToProjects[user.user_id!] = {};

        dataStore.judgeQueues[user.user_id!] = {
            activeProjectID: null,
            queuedProjectID: null,
        };
    }

    public backup(): void {
        const date = new Date();
        const time = date.getTime();
        fs.writeFile(`./backups/dump-${time}.json`, JSON.stringify(dataStore.asJSON(), null, 0), 'utf-8', () => {
            console.log(`Saved to ./dump-${time}.json`);
        });
    }

    private async fetchUsers(): Promise<void> {
        const usersResult = await Users.findAll();
        for (const user of usersResult) {
            const userModel = user.toJSON();

            this.initializeUser(userModel);
        }
    }

    private async fetchBallots(): Promise<void> {
        const ballotsResult = await Ballots.findAll();
        for (const ballot of ballotsResult) {
            const actualBallot = ballot.toJSON();
            this.ballots[actualBallot.ballot_id!] = actualBallot;
            switch (actualBallot.ballot_status) {
                case BallotStatus.Pending:
                    if (!this.judgeQueues[actualBallot.user_id]) {
                        this.judgeQueues[actualBallot.user_id] = {
                            activeProjectID: null,
                            queuedProjectID: null,
                        };
                    }

                    this.judgeQueues[actualBallot.user_id].queuedProjectID = actualBallot.project_id;

                    break;
                case BallotStatus.Assigned:
                case BallotStatus.Started:
                    if (!this.judgeQueues[actualBallot.user_id]) {
                        this.judgeQueues[actualBallot.user_id] = {
                            activeProjectID: null,
                            queuedProjectID: null,
                        };
                    }

                    this.judgeQueues[actualBallot.user_id].activeProjectID = actualBallot.project_id;
                    break;
                case BallotStatus.Skipped:
                case BallotStatus.Submitted:
                    if (!this.judgedProjects[actualBallot.user_id]) {
                        this.judgedProjects[actualBallot.user_id] = [];
                    }
                    this.judgedProjects[actualBallot.user_id].push(actualBallot.project_id);
                    break;
            }

            if (!dataStore.usersToProjects[actualBallot.user_id]) {
                dataStore.usersToProjects[actualBallot.user_id] = {};
            }

            if (!dataStore.usersToProjects[actualBallot.user_id][actualBallot.project_id]) {
                dataStore.usersToProjects[actualBallot.user_id][actualBallot.project_id] = [];
            }

            dataStore.usersToProjects[actualBallot.user_id][actualBallot.project_id].push(actualBallot.ballot_id!);
        }
    }

    private asJSON(): any {
        const jsonProjects: { [projectID: number]: {
            project_id: number;
            devpost_id: string;
            name: string;
            table_number: string;
            expo_number: number;
            sponsor_prizes: string;
            categories: number[];
        }} = {};

        for (const project of Object.values(dataStore.projects)) {
            const categoryArray = Object.values(project.categories).map((category) => {
                return category.category_id!;
            });

            jsonProjects[project.project_id!] = {
                ...project,
                project_id: project.project_id!,
                categories: categoryArray,
            };
        }

        const jsonCategories: { [categoryID: number]: {
            category_id: number;
            name: string;
            is_primary: boolean;
            criteria: number[];
        }} = {};

        for (const category of Object.values(dataStore.categories)) {
            const criteriaArray = Object.values(category.criteria).map((criteria) => {
                return criteria.criteria_id!;
            });

            jsonCategories[category.category_id!] = {
                ...category,
                category_id: category.category_id!,
                criteria: criteriaArray,
            };
        }

        return {
            ballots: dataStore.ballots,
            categories: jsonCategories,
            criteria: dataStore.criteria,
            projects: jsonProjects,
            users: dataStore.users,
            judgeQueues: dataStore.judgeQueues,
            judgedProjects: dataStore.judgedProjects,
            usersToProjects: dataStore.usersToProjects,
        };
    }


}

export const createDataStore = async () => {
    dataStore = new DataStore();
    await dataStore.fetchCollective();
};

export let dataStore: DataStore;
