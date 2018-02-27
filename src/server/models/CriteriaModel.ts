import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { Categories } from './CategoryModel';

// Catch-all import because we want SequelizeStatic.Model and not Sequelize.Model
const { INTEGER, STRING, SMALLINT } = Sequelize;

export interface ICriteriaModel {
    criteria_id: number;
    name: string;
    rubric: string;
    min_score: number;
    max_score: number;
}

interface CriteriaModel extends ICriteriaModel {
    category_id: number;
}

export const Criteria: Sequelize.Model<undefined, CriteriaModel> =
    sequelize.define<undefined, CriteriaModel>('criteria', {
        criteria_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: STRING(64), allowNull: false },
        rubric: { type: STRING(512) },
        min_score: { type: SMALLINT },
        max_score: { type: SMALLINT },
        category_id: {
            type: INTEGER, allowNull: false, references: {
                model: Categories, key: 'category_id',
            },
        },
    });
