import { Logger } from '../util/Logger';
import { printAndThrowError } from '../util/common';
import { ProjectModel, Projects } from '../models/ProjectModel';
import { sequelize } from '../db';

const logger = Logger('controllers/ProjectService');

interface ProjectSerializer {
    [index: string]: any;
    categories: string[];
}

export class ProjectService {
    public static async batchUploadProjects(projects: ProjectSerializer[]):
        Promise<void> {
            // Serialize BatchProjects to Batch Model:
            const projectModels: ProjectModel[] = [];
            for (const project of projects) {
                const projectDetails: any = {};
                for (const key of Object.keys(this.ProjectsToModel)) {
                    console.log(key);
                    if (!(key in Object.keys(project))) {
                        printAndThrowError('batchCreate', logger);
                    }

                    projectDetails[this.ProjectsToModel[key]] = project[key];
                }

                // const projectCategoryInfo:
                //     number[] =
                //     await sequelize.query(
                //         `SELECT category_id FROM
                //     categories WHERE name IN(:categories)`,
                //         {
                //             replacements: {
                //                 projects: Array.from(project.categories),
                //             },
                //             type: sequelize.QueryTypes.SELECT,
                //         });
                // projectDetails.categories = projectCategoryInfo;
                console.log(projectDetails);
                projectModels.push(projectDetails);
            }
            await Projects.bulkCreate(projectModels)
                .catch(printAndThrowError('batchCreate', logger));
        }


    private static ProjectsToModel : {[index: string]: string} = {
        devpost_link: 'devpost_id',
        project_name: 'name',
        location: 'table_number',
    };
}
