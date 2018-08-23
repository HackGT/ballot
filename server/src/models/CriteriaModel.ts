import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { Categories } from './CategoryModel';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER, STRING, SMALLINT } = Sequelize;

export interface CriteriaModel {
    criteria_id?: number;
    name: string;
    rubric: string;
    min_score: number;
    max_score: number;
    category_id: number;
}

export interface CriteriaInstance extends Sequelize.Instance<CriteriaModel> {
}

export const Criteria: Sequelize.Model<CriteriaInstance, CriteriaModel> =
    sequelize.define<CriteriaInstance, CriteriaModel>('criteria', {
        criteria_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(64), allowNull: false },
        rubric: { type: STRING(512) },
        min_score: { type: SMALLINT, defaultValue: 1 },
        max_score: { type: SMALLINT, defaultValue: 5 },
        category_id: {
            type: INTEGER, allowNull: false, references: {
                model: Categories, key: 'category_id',
            },
        },
    });

