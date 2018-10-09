import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { CriteriaModel, CriteriaInstance } from './CriteriaModel';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER, STRING, BOOLEAN } = Sequelize;

export interface CategoryModelWithoutCriteria {
    category_id?: number;
    name: string;
    is_primary: boolean;
}

export interface CategoryModel extends CategoryModelWithoutCriteria {
    criteria: CriteriaModel[];
}

export interface CategoryInstance extends
    Sequelize.Instance<CategoryModelWithoutCriteria> {
    criteria?: CriteriaInstance[];
}

export const Categories: Sequelize.Model<
    CategoryInstance,
    CategoryModelWithoutCriteria> =
    sequelize.define<CategoryInstance, CategoryModel>('categories', {
        category_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(512), allowNull: false },
        is_primary: { type: BOOLEAN, allowNull: false },
    });
