import { ProjectModel, Projects } from '../../models/ProjectModel';
import { ProjectService } from '../../controllers/ProjectService';
import { Action } from '../../util/Permissions';
import { ProjectCategories } from '../../models/ProjectCategoriesModel';

const resolvers = {
    Query: {
        project: async (obj: any, args: any, context: any) => {
            let project: ProjectModel[];
            project = await ProjectService.find();
            return project;
        },
    },
    Mutation: {
        batchUploadProjects: async (obj: any, args: any, context: any) => {
            if (!context.user || !context.user.can(Action.BatchUploadProjects)) {
                throw new Error('You do not have permission to upload projects');
            }

            if (args.projects) {
                await Projects.destroy({
                    truncate: true,
                });
                await ProjectCategories.destroy({
                    truncate: true,
                });
                return await ProjectService.serializeProjects(args.projects);
            } else {
                throw new Error('Must specify projects');
            }
        },
    },
};

export default resolvers;
