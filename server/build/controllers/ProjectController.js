"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const CategoryController_1 = __importDefault(require("./CategoryController"));
const Project_1 = require("../entity/Project");
const TableGroupController_1 = __importDefault(require("./TableGroupController"));
const User_1 = require("../entity/User");
const Ballot_1 = require("../entity/Ballot");
class ProjectController {
    static async getAllProjects() {
        const projectRepository = typeorm_1.getRepository(Project_1.Project);
        const allProjects = await projectRepository.find({
            relations: ['categories', 'tableGroup'],
        });
        const projectsToReturn = this.serverToClient(allProjects);
        return projectsToReturn;
    }
    static async batchUploadProjects(projects) {
        const projectRepository = typeorm_1.getRepository(Project_1.Project);
        await projectRepository.delete({});
        const allProjects = await projectRepository.save(this.clientToServer(projects));
        return this.serverToClient(allProjects);
    }
    static async updateProject(project) {
        const projectRepository = typeorm_1.getRepository(Project_1.Project);
        const updatedProject = await projectRepository.save(this.clientToServer([project]));
        return this.serverToClient(updatedProject);
    }
    static async queueProject(projectID, userID) {
        const ballotRepository = typeorm_1.getRepository(Ballot_1.Ballot);
        const projectRepository = typeorm_1.getRepository(Project_1.Project);
        const userRepository = typeorm_1.getRepository(User_1.User);
        const [project, user, submittedBallots, assignedBallots] = await Promise.all([
            await projectRepository.findOne(projectID, {
                relations: ['categories', 'categories.criteria',],
            }),
            await userRepository.findOne(userID),
            await ballotRepository.find({
                where: [{
                        user: { id: userID },
                        project: { id: projectID },
                        status: Ballot_1.BallotStatus.Skipped,
                    }, {
                        user: { id: userID },
                        project: { id: projectID },
                        status: Ballot_1.BallotStatus.Started,
                    }, {
                        user: { id: userID },
                        project: { id: projectID },
                        status: Ballot_1.BallotStatus.Submitted,
                    }]
            }),
            await ballotRepository.find({
                where: {
                    user: { id: userID },
                    status: Ballot_1.BallotStatus.Assigned,
                },
                relations: ['criteria', 'user', 'project'],
            }),
        ]);
        if (!project || !user) {
            throw new Error('Project or User does not exist');
        }
        console.log(submittedBallots);
        if (submittedBallots.length > 0) {
            throw new Error('Project was already submitted, started, or skipped');
        }
        const removedBallotIDs = assignedBallots.map((ballot) => {
            return ballot.id;
        });
        if (assignedBallots.length > 0) {
            await ballotRepository.remove(assignedBallots);
        }
        const newBallots = [];
        for (const category of project.categories) {
            console.log(category);
            if (!category.generated) {
                const criteria = category.criteria;
                for (const criterion of criteria) {
                    const newBallot = new Ballot_1.Ballot();
                    newBallot.status = Ballot_1.BallotStatus.Assigned;
                    newBallot.project = project;
                    newBallot.criteria = criterion;
                    newBallot.user = user;
                    newBallot.score = 0;
                    newBallots.push(newBallot);
                }
            }
        }
        console.log('ballots', newBallots);
        await ballotRepository.save(newBallots);
        return {
            newBallots,
            removedBallotIDs
        };
    }
    static async dequeueProject(projectID, userID) {
        const ballotRepository = typeorm_1.getRepository(Ballot_1.Ballot);
        const ballotsToRemove = await ballotRepository.find({
            where: {
                user: { id: userID },
                project: { id: projectID },
                status: Ballot_1.BallotStatus.Assigned,
            },
        });
        if (!ballotsToRemove) {
            return 'Ballots do not exist';
        }
        ballotRepository.remove(ballotsToRemove);
        return ballotsToRemove.map((ballot) => ballot.id);
    }
    static clientToServer(projects) {
        return projects.map((project) => {
            const { id, name, devpostURL, expoNumber, tableNumber, tags, tableGroupID, categoryIDs, } = project;
            return {
                id, name, devpostURL, expoNumber, tableNumber, tags,
                categories: categoryIDs.map((categoryID) => CategoryController_1.default.categoryDictionary[categoryID]),
                tableGroup: TableGroupController_1.default.tableGroupDictionary[tableGroupID],
            };
        });
    }
    static serverToClient(projects) {
        return projects.reduce((dict, project) => {
            const { id, name, devpostURL, expoNumber, tableNumber, tags, tableGroup, categories, } = project;
            dict[id] = {
                id, name, devpostURL, expoNumber, tableNumber, tags,
                tableGroupID: tableGroup.id,
                categoryIDs: categories.map((category) => category.id),
            };
            return dict;
        }, {});
    }
}
exports.default = ProjectController;
