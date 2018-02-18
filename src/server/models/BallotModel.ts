import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { Projects } from './ProjectModel';
import { Criteria } from './CriteriaModel';
import { Users } from './UserModel';

// Catch-all import because we want SequelizeStatic.Model and not Sequelize.Model
const { INTEGER, SMALLINT, DATE } = Sequelize;

export enum BallotStatus {
    unfilled = 0,
    filled = 1,
    reviewed = 2,
}

export interface IBallotModel {
    ballot_id: number;
    project_id: number;
    criteria_id: number;
    user_id: number;
    judge_priority: number;
    status: BallotStatus;
    score: number;
    score_submitted_at: Date;
}

export const Ballots: Sequelize.Model<undefined, IBallotModel> =
    sequelize.define<undefined, IBallotModel>('ballots', {
        ballot_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        project_id: {
            type: INTEGER, allowNull: false, references: {
                model: Projects, key: 'project_id',
            },
        },
        criteria_id: {
            type: INTEGER, allowNull: false, references: {
                model: Criteria, key: 'criteria_id',
            },
        },
        user_id: {
            type: INTEGER, allowNull: false, references: {
                model: Users, key: 'user_id',
            },
        },
        status: { type: SMALLINT, allowNull: false },
        score: { type: SMALLINT },
        score_submitted_at: { type: DATE },
    });
