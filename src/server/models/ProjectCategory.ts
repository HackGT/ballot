import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { Projects } from './ProjectModel';
import { Categories } from './CategoryModel';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER } = Sequelize;

export interface ProjectCategory {
    project_id: number;
    category_id: number;
}

export const ProjectCategories: Sequelize.Model<undefined, ProjectCategory> =
    sequelize.define<undefined, ProjectCategory>('project_categories', {
        project_id: {
            type: INTEGER, allowNull: false, references: {
                model: Projects, key: 'project_id',
            },
        },
        category_id: {
            type: INTEGER, allowNull: false, references: {
                model: Categories, key: 'category_id',
            },
        },
    });
