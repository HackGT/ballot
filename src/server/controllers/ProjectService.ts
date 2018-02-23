import { IProjectModel, Projects } from '../models/ProjectModel';
import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';
import { printAndThrowError } from '../util/common';

const logger = Logger('controllers/ProjectService');

export class ProjectService {

  public static find(): Promise<IProjectModel[]> {
    return Projects.sync()
      .then(() => Projects.findAll())
      .then((projects) => projects.map((project) => project.toJSON()))
      .catch(printAndThrowError('find', logger));
  }

  public static findById(id: number): Promise<IProjectModel | undefined> {
    return Projects.sync()
      .then(() => Projects.findById(id))
      .then((project) => project ? project.toJSON() : undefined)
      .catch(printAndThrowError('findById', logger));
  }

  public static findByName(name: string): Promise<IProjectModel | undefined> {
    return Projects.sync()
        .then(() => Projects.findOne({ where: { name } }))
        .then((project) => project ? project.toJSON() : undefined)
        .catch(printAndThrowError('findByName', logger));
  }

  public static create(project: IProjectModel): Promise<IProjectModel | undefined> {
    return Projects.sync()
      .then(() => Projects.create(project))
      .then((newProject) => newProject.toJSON())
      .catch(printAndThrowError('create', logger));
  }

  public static update(id: number, project: Partial<IProjectModel>): Promise<IProjectModel | undefined> {

    return Projects.sync()
      .then(() => Projects.update(project as IProjectModel, { where: { project_id: id}, returning: true}))
      .then(val => {
        const [num, projects] = val;
        if (num === 0 ) {
          logger.error('update id matched no existing project');
          return undefined;
        } else if (num > 1) {
          throw new Error('Update query modified more than one project');
        }
        return projects[0]!.toJSON();
    }).catch(printAndThrowError('update', logger));

  }

  public static delete(id: number): Promise<void> {
    return Projects.sync()
      .then(() => Projects.destroy({ where: { user_id: id } }))
      .then((num) => {
        if (num === 0) {
          throw new Error('No rows deleted');
        } else if (num > 1) {
          throw new Error('More than one row deleted');
        }
      }).catch(printAndThrowError('delete', logger));
  }
}
