import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { CategoryModel, CategoryInstance } from './CategoryModel';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER, STRING, SMALLINT } = Sequelize;

export interface ProjectModelWithoutCategories {
    project_id: number;
    devpost_id: string;
    name: string;
    table_number: number;
    expo_number: number;
}

export interface ProjectModel extends ProjectModelWithoutCategories {
    categories: CategoryModel[];
}

export interface ProjectInstance
            extends Sequelize.Instance<ProjectModelWithoutCategories> {
    categories?: CategoryInstance[];
}

export const Projects: Sequelize.Model<ProjectInstance,
    ProjectModelWithoutCategories> =
    sequelize.define<ProjectInstance, ProjectModelWithoutCategories>('projects', {
        project_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        devpost_id: { type: STRING(64), allowNull: false, unique: true },
        name: { type: STRING(64), allowNull: false },
        table_number: { type: SMALLINT },
        expo_number: { type: SMALLINT },
    });
