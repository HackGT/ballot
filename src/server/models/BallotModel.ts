import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';
import { Projects } from './ProjectModel';
import { Criteria } from './CriteriaModel';
import { Users } from './UserModel';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER, SMALLINT, DATE, ENUM } = Sequelize;

export enum BallotStatus {
    Pending = 'Pending',
    Assigned = 'Assigned',
    Submitted = 'Submitted',
    Reviewed = 'Reviewed',
}

export interface BallotModel {
    ballot_id: number;
    project_id: number;
    criteria_id: number;
    user_id: number;
    judge_priority: number;
    status: BallotStatus;
    score: number;
    score_submitted_at: Date;
}

export const Ballots: Sequelize.Model<undefined, BallotModel> =
    sequelize.define<undefined, BallotModel>('ballots', {
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
        status: {
            type: ENUM('Pending', 'Assigned', 'Submitted', 'Reviewed'),
            allowNull: false,
        },
        score: { type: SMALLINT },
        score_submitted_at: { type: DATE },
    });
