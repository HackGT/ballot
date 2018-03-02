import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { CategoryModelWithCriteria } from './CategoryModel';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER, STRING, SMALLINT } = Sequelize;

interface ProjectModel {
    project_id: number;
    devpost_id: string;
    name: string;
    table_number: number;
    expo_number: number;
}

export interface ProjectModelWithCategories extends ProjectModel {
    categories: CategoryModelWithCriteria[];
}

export const Projects: Sequelize.Model<undefined, ProjectModel> =
    sequelize.define<undefined, ProjectModel>('projects', {
        project_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        devpost_id: { type: STRING(64), allowNull: false, unique: true },
        name: { type: STRING(64), allowNull: false },
        table_number: { type: SMALLINT },
        expo_number: { type: SMALLINT },
    });
