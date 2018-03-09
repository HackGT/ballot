import { Logger } from '../util/Logger';
import { printAndThrowError } from '../util/common';
import { ProjectModel, Projects, ProjectInstance } from '../models/ProjectModel';
import { sequelize } from '../db';

const logger = Logger('controllers/ProjectService');

interface ProjectSerializer {
    [index: string]: any;
    categories: string[];
}

interface CategoryMapper {
    [key: string] : CategoryQueryResult[];
}

interface CategoryQueryResult {
    category_id: number;
}

export class ProjectService {
    public static async batchUploadProjects(projects: ProjectSerializer[]):
        Promise<void> {
            // Serialize BatchProjects to Batch Model:
            const projectModels: ProjectModel[] = [];
            const categoryMappings: CategoryMapper = {};
            for (const project of projects) {
                const projectDetails: any = {};
                for (const key of Object.keys(this.ProjectsToModel)) {
                    if (key !== 'PRIMARY_INDEX') {
                        projectDetails[this.ProjectsToModel[key]] = project[key];
                    }
                }

                const projectCategoryInfo:
                    CategoryQueryResult[] =
                    await sequelize.query(
                        `SELECT category_id FROM
                    categories WHERE name IN(:categories)`,
                        {
                            replacements: {
                                categories: Array.from(project.categories),
                            },
                            type: sequelize.QueryTypes.SELECT,
                        });
                
                categoryMappings[project[this.ProjectsToModel.PRIMARY_INDEX]] = projectCategoryInfo;
                projectModels.push(projectDetails);
            }

            await Projects.bulkCreate(projectModels, {returning: true})
                .catch(printAndThrowError('batchCreate', logger)).then((instances: ProjectInstance[]) => {
                    for (const instance of instances) {
                        const categories : CategoryQueryResult[] = categoryMappings[instance.getDataValue('devpost_id')];
                        for (const category of categories) {
                            instance.addCategory(category.category_id);
                        }
                    }
                });
        }


    private static ProjectsToModel : {[index: string]: string} = {
        devpost_link: 'devpost_id',
        project_name: 'name',
        location: 'table_number',
        PRIMARY_INDEX: 'devpost_link',
    };
}
