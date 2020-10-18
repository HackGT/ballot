import { getRepository } from 'typeorm';

import CategoryController from './CategoryController';
import { Project, ProjectClientState } from '../entity/Project';
import TableGroupController from './TableGroupController';
import {Category} from "../entity/Category";
import Environment from '../config/Environment';
const fetch = require('node-fetch');

interface ProjectFromSubmit {
  projectId: number;
  name: string;
  devpost: string;
  expo: number;
  prizes: String[];
  wherebyRoom: {
    startDate: string;
    endDate: string;
    roomUrl: string;
    meetingId: string;
    hostRoomUrl: string;
  };
  _id: string;
}

class SubmitController {

  public static async importProjects(withCategories: String, accepted: String) {
    let exportEndpoint = '/ballot/export';
    if (accepted === 'true') {
      exportEndpoint = '/ballot/exportAccepted';
    }
    const result = await fetch(Environment.getSubmitURL() + exportEndpoint,
      {
        headers: {
          'Authorization': 'Bearer ' + Environment.getSubmitSecret()
        }
      // @ts-ignore
      }).then(res => res.json());

    if (result.error) {
      throw new Error(result.error);
    }

    const prizes = await result.categories;
    const projects = await result.projects;

    if (withCategories === 'true') {
      await CategoryController.deleteGeneratedCategories();

      await CategoryController.updateCategory(
        await prizes.map((categoryName: String) => {
          return {
            name: categoryName,
            isDefault: false,
            generated: true,
            description: `Sponsor prize generated when projects were imported. Do not remove. - ${categoryName}`,
            company: '',
            criteria: [],
          };
        }));
    }

    const categories: { [categoryID: number]: any } = await CategoryController.getAllCategories();
    const defaultCategories: { [categoryID: number]: any } = await CategoryController.getDefaultCategories();

    const tableGroups: { [tableGroupID: number]: any } = await TableGroupController.getAllTableGroups();
    // we will assign all projects to first table group
    const [key, value] = Object.entries(tableGroups)[0];

    const projectRepository = getRepository(Project);
    await projectRepository.delete({});
    const allProjects: Project[] = await projectRepository.save(
      await projects.map((project: ProjectFromSubmit, i: number) => {
        for (const [key, value] of Object.entries(defaultCategories)) {
          project.prizes.push(value.name);
        }
        return {
          submitId: project.projectId,
          name: project.name,
          devpostURL: project.devpost,
          roundNumber: 1,
          expoNumber: (accepted === 'true') ? project.expo : 1,
          tableNumber: project.projectId,
          tags: {},
          roomUrl: project.wherebyRoom.roomUrl,
          tableGroup: TableGroupController.tableGroupDictionary[value.id],
          categories: project.prizes.map((category: String) => this.findCategory(categories, defaultCategories, category))

        }
      })
    );
    return this.serverToClient(allProjects);
  }

  public static async sendAcceptedProjectsToSubmit() {
    const projectRepository = getRepository(Project);
    const allProjects = await projectRepository.find({
      where: {
        roundNumber: 2
      }
    });

    const projects = await allProjects.map((project, i) => {
      return { projectId: project.submitId, expoNumber: i % 2 + 1 }
    });
    const result = await fetch(Environment.getSubmitURL() + '/ballot/accept-projects',
      {
        method: 'post',
        body: JSON.stringify({projects: projects}),
        headers: {
          'Authorization': 'Bearer ' + Environment.getSubmitSecret(),
          'Content-Type': 'application/json'
        }
        // @ts-ignore
      }).then(res => res.json());
      console.log(result);
  }

  private static serverToClient(projects: Project[]): ProjectClientState {
    return projects.reduce((dict: ProjectClientState, project: Project) => {
      const {
        id,
        name,
        devpostURL,
        expoNumber,
        roundNumber,
        tableNumber,
        roomUrl,
        tags,
        tableGroup,
        categories,
      } = project;
      dict[id!] = {
        id, name, devpostURL, expoNumber, roundNumber, tableNumber, roomUrl, tags,
        tableGroupID: tableGroup.id!,
        categoryIDs: categories ? categories.map((category) => category.id!) : [],
      };
      return dict;
    }, {});
  }

  private static findCategory(categories: { [categoryID: number]: any }, defaultCategories: { [categoryID: number]: any }, categoryName: String): Category {
    for (const [key, value] of Object.entries(categories)) {
      if (value.name === categoryName) {
        return value;
      }
    }
    for (const [key, value] of Object.entries(defaultCategories)) {
      if (value.name === categoryName) {
        return value;
      }
    }
    return new Category();
  }
}

export default SubmitController;
