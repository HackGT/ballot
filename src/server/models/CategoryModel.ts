import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { CriteriaModel } from './CriteriaModel';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER, STRING, BOOLEAN } = Sequelize;

interface CategoryModel {
    category_id: number;
    name: string;
    is_primary: boolean;
}

export interface CategoryModelWithCriteria {
    criteria: CriteriaModel[];
}

interface CategoryInstance extends Sequelize.Instance<CategoryModel> {
}

export const Categories: Sequelize.Model<CategoryInstance, CategoryModel> =
    sequelize.define<CategoryInstance, CategoryModel>('categories', {
        category_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(64), allowNull: false },
        is_primary: { type: BOOLEAN, allowNull: false },
    });
