import { ProjectModel, Projects, ProjectModelWithoutCategories } from '../models/ProjectModel';
import { dataStore } from '../store/DataStore';
import { CategoryModel } from '../models/CategoryModel';
import { ProjectCategories, ProjectCategory } from '../models/ProjectCategoriesModel';

interface ProjectsInput {
    name: string;
    devpost_id: string;
    expo_number: number;
    table_number: string;
    sponsor_prizes: string;
}

export class ProjectService {
    public static find(): ProjectModel[] {
        return Object.values(dataStore.projects);
    }

    public static async serializeProjects(projects: ProjectsInput[]): Promise<ProjectModel[]> {
        const projectModels: ProjectModelWithoutCategories[] = [];

        for (const project of projects) {
            const newProject: ProjectModelWithoutCategories = {
                devpost_id: project.devpost_id,
                name: project.name,
                table_number: project.table_number,
                expo_number: project.expo_number,
                sponsor_prizes: project.sponsor_prizes,
            };

            projectModels.push(newProject);
        }

        const values = await Projects.bulkCreate(projectModels, {
            returning: true,
        });

        const projectCategoryIDs: ProjectCategory[] = [];
        const resultProjects: ProjectModel[] = [];

        for (const projectValue of values) {
            const projectCategories: CategoryModel[] = [];
            const project = projectValue.toJSON();
            for (const category of Object.values(dataStore.categories)) {
                if (project.sponsor_prizes.includes(category.name) || category.is_primary) {
                    projectCategoryIDs.push({
                        project_id: project.project_id!,
                        category_id: category.category_id!,
                    });
                    projectCategories.push(category);
                }
            }

            const newProject: ProjectModel = {
                project_id: project.project_id,
                devpost_id: project.devpost_id,
                name: project.name,
                table_number: project.table_number,
                expo_number: project.expo_number,
                sponsor_prizes: project.sponsor_prizes,
                categories: projectCategories,
            };

            resultProjects.push(newProject);
        }

        ProjectCategories.bulkCreate(projectCategoryIDs);

        dataStore.projects = resultProjects;

        return resultProjects;
    }
}
