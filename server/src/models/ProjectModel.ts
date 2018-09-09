import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { CategoryModel, CategoryInstance } from './CategoryModel';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER, STRING, SMALLINT } = Sequelize;

export interface ProjectModelWithoutCategories {
    project_id?: number;
    devpost_id: string;
    name: string;
    table_number: string;
    expo_number: number;
    sponsor_prizes: string;
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
        sponsor_prizes: { type: STRING(512) },
        table_number: { type: STRING(32) },
        expo_number: { type: SMALLINT },
    });
