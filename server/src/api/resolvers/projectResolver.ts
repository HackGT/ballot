import { ProjectModel } from '../../models/ProjectModel';
import { ProjectService } from '../../controllers/ProjectService';

const resolvers = {
    Query: {
        project: async (obj: any, args: any, context: any) => {
            let project: ProjectModel[];
            project = await ProjectService.find();
            return project;
        },
    },
};

export default resolvers;
