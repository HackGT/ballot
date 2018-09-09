import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';

const { INTEGER } = Sequelize;

export interface ProjectCategory {
    project_id: number;
    category_id: number;
}

export const ProjectCategories: Sequelize.Model<ProjectCategory, ProjectCategory> =
    sequelize.define<ProjectCategory, ProjectCategory>('project_categories', {
        project_id: { type: INTEGER },
        category_id: { type: INTEGER },
    });
