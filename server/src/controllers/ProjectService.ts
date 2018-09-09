import { Logger } from '../util/Logger';
import { printAndThrowError } from '../util/common';
import { ProjectModel, Projects, ProjectInstance, ProjectModelWithoutCategories } from '../models/ProjectModel';
import { sequelize } from '../db';
import { Categories } from '../models/CategoryModel';
import { Criteria } from '../models/CriteriaModel';

const logger = Logger('controllers/ProjectService');
const csv = require('csv');

interface ProjectSerializer {
    [index: string]: any;
    categories: string[];
}

interface CategoryMapper {
    [key: string]: CategoryQueryResult[];
}

interface CategoryQueryResult {
    category_id: number;
}

export class ProjectService {
    public static find(): Promise<ProjectModel[]> {
        return Projects.findAll({
            include: [{ model: Categories }],
        })
        .then((project) =>
            project.map((project) => {
                return {
                    ...project.toJSON(),
                    categories: project.categories!.map((category) => category.toJSON())
                };
            })
        ).catch(printAndThrowError('find', logger));
    }

    public static async serializeProjects(projects: string):
        Promise<void> {
            const parent = this;
            const projectsSerialized: ProjectSerializer[] = [];
            csv.parse(projects, (err: any, data: string[][]) => {
                const columns: string[] = data.shift()!
                    .filter((header) => Object.keys(parent.ProjectsToModel)
                    .includes(header));
                for (const row of data) {
                    let counter = 0;
                    const project: ProjectSerializer = {
                        categories: [],
                    };
                    while (counter < columns.length) {
                        const column: string = columns[counter];
                        if (column == 'categories') {
                            project[parent.ProjectsToModel[column]] =
                                row[counter].split(',');
                        } else {
                            project[parent.ProjectsToModel[column]] =
                                row[counter];
                        }
                        counter += 1;
                    }
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

                categoryMappings[projectDetails[
                    this.ProjectsToModel.PRIMARY_INDEX
                ]] = projectCategoryInfo;

                projectModels.push(projectDetails);
            }
            console.log(categoryMappings);
            await Projects.bulkCreate(projectModels, {returning: true})
                .catch(printAndThrowError('batchCreate', logger))
                .then((instances: ProjectInstance[]) => {
                    for (const instance of instances) {
                        const categories: CategoryQueryResult[] =
                            categoryMappings[instance.getDataValue('devpost_id')];
                        for (const category of categories) {
                            instance.addCategory(category.category_id);
                        }
                    }
                });
        }

    private static ProjectsToModel: {[index: string]: string} = {
        devpost_link: 'devpost_id',
        project_name: 'name',
        location: 'table_number',
        categories: 'categories',
        PRIMARY_INDEX: 'devpost_id',
    };
}