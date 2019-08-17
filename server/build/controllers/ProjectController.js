"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const CategoryController_1 = __importDefault(require("./CategoryController"));
const Project_1 = require("../entity/Project");
const TableGroupController_1 = __importDefault(require("./TableGroupController"));
class ProjectController {
    static async getAllProjects() {
        const projectRepository = typeorm_1.getRepository(Project_1.Project);
        const allProjects = await projectRepository.find({
            relations: ['category'],
        });
        const projectsToReturn = this.serverToClient(allProjects);
        console.log('projects to return', projectsToReturn);
        return projectsToReturn;
    }
    static async batchUploadProjects(projects) {
        const projectRepository = typeorm_1.getRepository(Project_1.Project);
        await projectRepository.clear();
        const allProjects = await projectRepository.save(this.clientToServer(projects));
        return this.serverToClient(allProjects);
    }
    static async updateProject(project) {
        const projectRepository = typeorm_1.getRepository(Project_1.Project);
        const updatedProject = await projectRepository.save(this.clientToServer([project]));
        return this.serverToClient(updatedProject);
    }
    static clientToServer(projects) {
        return projects.map((project) => {
            const { id, name, devpostURL, expoNumber, tableNumber, tags, tableGroupID, categoryIDs, } = project;
            return {
                id, name, devpostURL, expoNumber, tableNumber, tags,
                categories: categoryIDs.map(categoryID => CategoryController_1.default.categoryDictionary[categoryID]),
                tableGroup: TableGroupController_1.default.tableGroupDictionary[tableGroupID],
            };
        });
    }
    static serverToClient(projects) {
        return projects.reduce((dict, project) => {
            const { id, name, devpostURL, expoNumber, tableNumber, tags, tableGroup, categories, } = project;
            dict[project.id] = {
                id, name, devpostURL, expoNumber, tableNumber, tags,
                tableGroupID: tableGroup.id,
                categoryIDs: categories.map(category => category.id),
            };
            return dict;
        }, {});
    }
}
exports.default = ProjectController;
