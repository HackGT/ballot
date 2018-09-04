import { BallotModel, Ballots, BallotStatus } from '../models/BallotModel';
import { CategoryModel, Categories } from '../models//CategoryModel';
import { ProjectModel, Projects } from '../models//ProjectModel';
import { CriteriaModel, Criteria } from '../models//CriteriaModel';
import { Users, SafeUserModel } from '../models//UserModel';
import { printAndThrowError } from '../util/common';
import { Logger } from '../util/Logger';

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

    constructor() {
        this.ballots = {};
        this.categories = {};
        this.criteria = {};
        this.projects = {};
        this.users = {};

        this.judgeQueues = {};
        this.judgedProjects = {};

        this.fetchUsers();
        this.fetchBallots();
        this.fetchCollective();
    }

    public async queueProject(eventID: number, userID: number, projectID: number): Promise<{ eventID: number, status: boolean, message: string }> {
        if (!this.judgeQueues[userID]) {
            this.judgeQueues[userID] = {
                activeProjectID: null,
                queuedProjectID: null,
            };
        }

        if (this.judgedProjects[userID].includes(projectID)) {
            return {
                eventID,
                status: false,
                message: 'Project was already scored by this judge'
            }
        }

        this.judgeQueues[userID].push(projectID);

        const newBallots: BallotModel[] = [];

        for (const category of this.projects[projectID].categories) {
            for (const criteria of this.categories[category.category_id!].criteria) {
                newBallots.push({
                    project_id: projectID,
                    user_id: userID,
                    criteria_id: criteria.criteria_id!,
                    judge_priority: this.judgeQueues[userID].length,
                    ballot_status: BallotStatus.Pending,
                });
            }
        }

        await Ballots.bulkCreate(newBallots);

        return {
            eventID,
            status: true,
            message: 'Project sucessfully queued'
        }
    }

    public async dequeueProject(eventID: number, userID: number, projectID: number): Promise<{eventID: number, status: boolean, message: string}> {
        if (this.judgeQueues[userID]) {
            const projectIndex = this.judgeQueues[userID].indexOf(projectID);
            if (projectIndex > -1) {
                this.judgeQueues[userID].splice(projectIndex, 1);

                await Ballots.destroy({
                    where: {
                        user_id: userID,
                        project_id: projectID,
                        ballot_status: BallotStatus.Pending,
                    }
                });

                return {
                    eventID,
                    status: true,
                    message: 'Project successfully dequeued'
                }
            }
        }

        printAndThrowError('dequeueProject', Logger);
        return {
            eventID,
            status: false,
            message: 'Project not found in queue'
        }
    }

    private async fetchBallots(): Promise<void> {
        const ballotsResult = await Ballots.findAll();
        for (const ballot of ballotsResult) {
            this.ballots[ballot.toJSON().ballot_id!] = ballot.toJSON();
        }
    }

    private async fetchCollective(): Promise<void> {
        await this.fetchCategories();

        const criteriaResult = await Criteria.findAll();
        for (const criteria of criteriaResult) {
            const criteriaModel = criteria.toJSON();
            this.criteria[criteriaModel.criteria_id!] = criteriaModel;
            this.categories[criteriaModel.category_id].criteria.push(criteriaModel);
        }

        await this.fetchProjects();
    }

    private async fetchCategories(): Promise<void> {
        const categoryResult = await Categories.findAll();
        for (const category of categoryResult) {
            this.categories[category.toJSON().category_id!] = {
                ...category.toJSON(),
                criteria: [],
            };
        }
    }

    private async fetchProjects(): Promise<void> {
        const projectsResult = await Projects.findAll({
            include: [{ model: Categories }],
        });
        for (const project of projectsResult) {
            this.projects[project.toJSON().project_id] = {
                ...project.toJSON(),
                categories: project.categories!.map((category) => this.categories[category.toJSON().category_id!]),
            };
        }
    }

    private async fetchUsers(): Promise<void> {
        const usersResult = await Users.findAll();
        for (const user of usersResult) {
            const userModel = user.toJSON()
            this.users[userModel.user_id!] = {
                user_id: userModel.user_id,
                email: userModel.email,
                name: userModel.name,
                user_class: userModel.user_class,
            };
        }
    }
}

export const dataStore = new DataStore();
