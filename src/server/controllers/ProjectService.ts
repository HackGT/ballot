import { Logger } from '../util/Logger';
import { printAndThrowError } from '../util/common';
import { ProjectModel, Projects, ProjectInstance } from '../models/ProjectModel';
import { sequelize } from '../db';

const logger = Logger('controllers/ProjectService');
const csv = require('csv');

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
    public static async serializeProjects(projects: string):
        Promise<void> {
            const parent = this;
            let projectsSerialized : ProjectSerializer[] = [];
            csv.parse(projects, function(err: any, data: string[][]) {
                let columns : string[] = data.shift()!.filter(header => Object.keys(parent.ProjectsToModel).includes(header));
                for (const row of data) {
                    let counter : number = 0;
                    let project : ProjectSerializer = {
                        categories: []
                    };
                    while (counter < columns.length) {
                        let column : string = columns[counter]
                        if (column == 'categories') {
                            project[parent.ProjectsToModel[column]] = row[counter].split(",");
                        } else {
                            project[parent.ProjectsToModel[column]] = row[counter];
                        }
                        counter += 1;
                    };
                    projectsSerialized.push(project);
                }
                console.log(projectsSerialized);
                parent.batchUploadProjects(projectsSerialized);
            });
        }

    public static async batchUploadProjects(projects: ProjectSerializer[]):
        Promise<void> {
            // Serialize BatchProjects to Batch Model:
            const projectModels: ProjectModel[] = [];
            const categoryMappings: CategoryMapper = {};
            for (const project of projects) {
                const projectDetails: any = project;

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
                
                categoryMappings[projectDetails[this.ProjectsToModel.PRIMARY_INDEX]] = projectCategoryInfo;

                projectModels.push(projectDetails);
            }
            console.log(categoryMappings);
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
        categories: 'categories',
        PRIMARY_INDEX: 'devpost_id',
    };
}
