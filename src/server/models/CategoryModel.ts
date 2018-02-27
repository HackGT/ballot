import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { ICriteriaModel } from './CriteriaModel';

// Catch-all import because we want SequelizeStatic.Model and not Sequelize.Model
const { INTEGER, STRING, BOOLEAN } = Sequelize;

interface CategoryModel {
    category_id: number;
    name: string;
    is_primary: boolean;
}

export interface ICategoryModel {
    category_id: number;
    name: string;
    is_primary: boolean;
    crtieria: ICriteriaModel[];
}

export const Categories: Sequelize.Model<undefined, CategoryModel> =
    sequelize.define<undefined, CategoryModel>('categories', {
        category_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(64), allowNull: false },
        is_primary: { type: BOOLEAN, allowNull: false },
    });
