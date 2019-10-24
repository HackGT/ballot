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
const app_1 = require("../app");
const socket_1 = require("../routes/socket");
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
        const [project, user, submittedBallots, pendingBallots] = await Promise.all([
            await projectRepository.findOne(projectID, {
                relations: ['categories', 'categories.criteria'],
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
                    }, {
                        user: { id: userID },
                        project: { id: projectID },
                        status: Ballot_1.BallotStatus.Assigned,
                    }],
            }),
            await ballotRepository.find({
                where: {
                    user: { id: userID },
                    status: Ballot_1.BallotStatus.Pending,
                },
                relations: ['criteria', 'user', 'project'],
            }),
        ]);
        if (!project || !user) {
            throw new Error('Project or User does not exist');
        }
        console.log(submittedBallots);
        if (submittedBallots.length > 0) {
            throw new Error('Project was already submitted, skipped, assigned, or started');
        }
        const removedBallotIDs = pendingBallots.map((ballot) => {
            return ballot.id;
        });
        if (pendingBallots.length > 0) {
            await ballotRepository.remove(pendingBallots);
        }
        const newBallots = [];
        for (const category of project.categories) {
            console.log(category);
            if (!category.generated && category.company === user.company) {
                const criteria = category.criteria;
                for (const criterion of criteria) {
                    const newBallot = new Ballot_1.Ballot();
                    newBallot.status = Ballot_1.BallotStatus.Pending;
                    newBallot.project = project;
                    newBallot.criteria = criterion;
                    newBallot.user = user;
                    newBallot.score = criterion.minScore;
                    newBallots.push(newBallot);
                }
            }
        }
        console.log('ballots', newBallots);
        await ballotRepository.save(newBallots);
        return {
            newBallots,
            removedBallotIDs,
        };
    }
    static async dequeueProject(projectID, userID) {
        const ballotRepository = typeorm_1.getRepository(Ballot_1.Ballot);
        const ballotsToRemove = await ballotRepository.find({
            relations: ['project'],
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
    static async getNextProject(userID) {
        const ballotRepository = typeorm_1.getRepository(Ballot_1.Ballot);
        const projectBallots = await ballotRepository.find({
            relations: ['criteria', 'user', 'project', 'project.tableGroup'],
            where: [{
                    user: { id: userID },
                    status: Ballot_1.BallotStatus.Assigned,
                }, {
                    user: { id: userID },
                    status: Ballot_1.BallotStatus.Started,
                }, {
                    user: { id: userID },
                    status: Ballot_1.BallotStatus.Pending,
                }],
        });
        const pendingBallots = [];
        const assignedBallots = [];
        const startedBallots = [];
        for (const ballot of projectBallots) {
            if (ballot.status === Ballot_1.BallotStatus.Pending) {
                pendingBallots.push(ballot);
            }
            else if (ballot.status === Ballot_1.BallotStatus.Assigned) {
                assignedBallots.push(ballot);
            }
            else if (ballot.status === Ballot_1.BallotStatus.Started) {
                startedBallots.push(ballot);
            }
        }
        if (startedBallots.length > 0) {
            return {
                project: this.serverToClient([startedBallots[0].project]),
                ballots: Ballot_1.convertToClient(startedBallots),
            };
        }
        if (assignedBallots.length > 0) {
            return {
                project: this.serverToClient([assignedBallots[0].project]),
                ballots: Ballot_1.convertToClient(assignedBallots),
            };
        }
        if (pendingBallots.length > 0) {
            const newBallots = pendingBallots.map((ballot) => {
                return {
                    ...ballot,
                    status: Ballot_1.BallotStatus.Assigned,
                };
            });
            await ballotRepository.save(newBallots);
            app_1.io.to(socket_1.SocketStrings.Authenticated).emit(socket_1.SocketStrings.ProjectGot, {
                newBallots: Ballot_1.convertToClient(newBallots),
            });
            return {
                project: this.serverToClient([pendingBallots[0].project]),
                ballots: Ballot_1.convertToClient(newBallots),
            };
        }
        return {
            project: null,
            ballots: {},
        };
    }
    static async scoreProject(ballots) {
        console.log(ballots);
        const ballotRepository = typeorm_1.getRepository(Ballot_1.Ballot);
        const repoBallots = await ballotRepository.findByIds(Object.keys(ballots), {
            relations: ['criteria', 'user', 'project'],
        });
        const ballotsToSave = repoBallots.map((ballot) => {
            return {
                ...ballot,
                score: ballots[ballot.id],
                status: Ballot_1.BallotStatus.Submitted,
            };
        });
        await ballotRepository.save(ballotsToSave);
        app_1.io.to(socket_1.SocketStrings.Authenticated).emit(socket_1.SocketStrings.ProjectScore, {
            newBallots: Ballot_1.convertToClient(ballotsToSave),
        });
        return true;
    }
    static async startProject(userID, projectID) {
        return this.setBallotStatus(userID, projectID, Ballot_1.BallotStatus.Started, socket_1.SocketStrings.ProjectStart);
    }
    static async skipProject(userID, projectID) {
        return this.setBallotStatus(userID, projectID, Ballot_1.BallotStatus.Skipped, socket_1.SocketStrings.ProjectSkip);
    }
    static async projectBusy(userID, projectID) {
        return this.setBallotStatus(userID, projectID, Ballot_1.BallotStatus.Busy, socket_1.SocketStrings.ProjectBusy);
    }
    static async projectMissing(userID, projectID) {
        return this.setBallotStatus(userID, projectID, Ballot_1.BallotStatus.Missing, socket_1.SocketStrings.ProjectMissing);
    }
    static async setBallotStatus(userID, projectID, ballotStatus, socketEmit) {
        const ballotRepository = typeorm_1.getRepository(Ballot_1.Ballot);
        const repoBallots = await ballotRepository.find({
            relations: ['criteria', 'user', 'project'],
            where: {
                user: { id: userID },
                project: { id: projectID },
            },
        });
        const ballotsToSave = repoBallots.map((ballot) => {
            return {
                ...ballot,
                status: ballotStatus,
            };
        });
        await ballotRepository.save(ballotsToSave);
        app_1.io.to(socket_1.SocketStrings.Authenticated).emit(socketEmit, {
            newBallots: Ballot_1.convertToClient(ballotsToSave),
        });
        return Ballot_1.convertToClient(ballotsToSave);
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
                categoryIDs: categories ? categories.map((category) => category.id) : [],
            };
            return dict;
        }, {});
    }
}
exports.default = ProjectController;
