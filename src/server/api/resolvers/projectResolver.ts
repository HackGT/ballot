import { ProjectService } from '../../controllers/ProjectService';
import { IProjectModel } from '../../models/ProjectModel';
import { ProjectFilter } from '../types/project';

const resolvers = {
  Query: {
    projects: async (obj: any, args: { filters?: ProjectFilter }, context: any) => {
      if (args.filters && args.filters.devpost_id && args.filters.project_id) {
        throw new Error('name and proejct_id are both unique identifiers, use only one');
      }

      let projects: IProjectModel[];

      if (args.filters && args.filters.devpost_id) {
        const res = await ProjectService.findByDevpostId(args.filters.devpost_id as string);
        projects = res ? [res] : [];
      } else if (args.filters && args.filters.project_id) {
        const res = await ProjectService.findById(args.filters.project_id as number);
        projects = res ? [res] : [];
      } else {
        projects = await ProjectService.find();
      }
      return projects;
    },
  },

  Mutation: {
    createProject: async (obj: any, args: any, context: any) => {
      const project = await ProjectService.create(args.input);
      return project;
    },
    updateProject: async (obj: any, args: any, context: any) => {
      const project = await ProjectService.update(args.id, args.input);
      return project;
    },
  },
};

export default resolvers;
