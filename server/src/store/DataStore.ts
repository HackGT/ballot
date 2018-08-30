import { BallotModel, Ballots } from '../models/BallotModel';
import { CategoryModel, Categories } from '../models//CategoryModel';
import { ProjectModel, Projects } from '../models//ProjectModel';
import { CriteriaModel, Criteria } from '../models//CriteriaModel';
import { UserModel, Users, SafeUserModel } from '../models//UserModel';

export class DataStore {
    public ballots: { [ballotID: number]: BallotModel };
    public categories: { [categoryID: number]: CategoryModel };
    public criteria: { [criteriaID: number]: CriteriaModel };
    public projects: { [projectID: number]: ProjectModel };
    public users: { [userID: number]: SafeUserModel };

    constructor() {
        this.ballots = {};
        this.categories = {};
        this.criteria = {};
        this.projects = {};
        this.users = {};

        this.fetchUsers();
        this.fetchBallots();
        this.fetchCollective();
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
