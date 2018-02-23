import { ProjectService } from '../../controllers/ProjectService';
import { IProjectModel } from '../../models/ProjectModel';
import { ProjectFilter } from '../types/project';

const resolvers = {
  Query: {
    projects: async (obj: any, args: { filters?: ProjectFilter }, context: any) => {
      if (args.filters && args.filters.name && args.filters.project_id) {
        throw new Error('name and proejct_id are both unique identifiers, use only one');
      }

      let projects: IProjectModel[];

      if (args.filters && args.filters.name) {
        const res = await ProjectService.findByName(args.filters.name as string);
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
    changeName: async (obj: any, args: any, context: any) => {
      const project = await ProjectService.update(args.id, { name: args.newName });
      return project;
    },
    changeTableNumber: async (obj: any, args: any, context: any) => {
      const project = await ProjectService.update(args.id, { table_number: args.newTableNumber });
      return project;
    },
    changeExpoNumber: async (obj: any, args: any, context: any) => {
      const project = await ProjectService.update(args.id, { expo_number: args.newExpoNumber });
      return project;
    },
  },
};

export default resolvers;
