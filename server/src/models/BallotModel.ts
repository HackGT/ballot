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
    Skipped = 'Skipped',
    Started = 'Started',
}

export interface BallotModel {
    ballot_id?: number;
    project_id: number;
    criteria_id: number;
    user_id: number;
    judge_priority: number;
    ballot_status: BallotStatus;
    score?: number;
    score_submitted_at?: Date;
}

export interface BallotInstance extends Sequelize.Instance<BallotModel> {
}

export const Ballots: Sequelize.Model<BallotInstance, BallotModel> =
    sequelize.define<BallotInstance, BallotModel>('ballots', {
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
        judge_priority: { type: INTEGER, allowNull: false },
        ballot_status: {
            type: ENUM('Pending', 'Assigned', 'Submitted', 'Skipped', 'Started'),
            allowNull: false,
        },
        score: { type: SMALLINT },
        score_submitted_at: { type: DATE },
    });
