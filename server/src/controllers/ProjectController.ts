import { getRepository } from 'typeorm';

import CategoryController from './CategoryController';
import { Project, ProjectClient, ProjectDictionary, EMPTY_PROJECT_DICTIONARY, ProjectClientState } from '../entity/Project';
import TableGroupController from './TableGroupController';

class ProjectController {
  public static async getAllProjects() {
    const projectRepository = getRepository(Project);
    const allProjects = await projectRepository.find({
      relations: ['category'],
    });
    const projectsToReturn = this.serverToClient(allProjects);
    console.log('projects to return', projectsToReturn);
    return projectsToReturn;
  }

  public static async batchUploadProjects(projects: ProjectClient[]) {
    const projectRepository = getRepository(Project);
    await projectRepository.clear();
    const allProjects: Project[] = await projectRepository.save(
      this.clientToServer(projects)
    );
    return this.serverToClient(allProjects);
  }

  public static async updateProject(project: ProjectClient) {
    const projectRepository = getRepository(Project);
    const updatedProject: Project[] = await projectRepository.save(
      this.clientToServer([project])
    );
    return this.serverToClient(updatedProject);
  }

  private static clientToServer(projects: ProjectClient[]): Partial<Project>[] {
    return projects.map((project: ProjectClient) => {
      const {
        id,
        name,
        devpostURL,
        expoNumber,
        tableNumber,
        tags,
        tableGroupID,
        categoryIDs,
      } = project;
      return {
        id, name, devpostURL, expoNumber, tableNumber, tags,
        categories: categoryIDs.map(categoryID => CategoryController.categoryDictionary[categoryID]),
        tableGroup: TableGroupController.tableGroupDictionary[tableGroupID],
      };
    });
  }

  private static serverToClient(projects: Project[]): ProjectClientState {
    return projects.reduce((dict: ProjectClientState, project: Project) => {
      const {
        id,
        name,
        devpostURL,
        expoNumber,
        tableNumber,
        tags,
        tableGroup,
        categories,
      } = project;
      dict[project.id!] = {
        id, name, devpostURL, expoNumber, tableNumber, tags,
        tableGroupID: tableGroup.id!,
        categoryIDs: categories.map(category => category.id!),
      };
      return dict;
    }, {});
  }
}

export default ProjectController;
