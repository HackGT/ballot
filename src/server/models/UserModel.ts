import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';

// Catch-all import because we want SequelizeStatic.Model and not Sequelize.Model
const { INTEGER, STRING, SMALLINT } = Sequelize;

export interface IUserModel {
    user_id?: number;
    email: string;
    name: string;
    user_class: UserClass;
    github?: string;
    google?: string;
    facebook?: string;
    salt?: string;
    hash?: string;
}

interface IUserInstance extends Sequelize.Instance<IUserModel> {
}

export enum UserClass {
    'Pending' = 0, // Created account, must be approved by admin/owner
    'Judge' = 1,
    'Admin' = 2,
    'Owner' = 3,   // First User, cannot be removed by another admin.
}

export const Users: Sequelize.Model<IUserInstance, IUserModel> = sequelize.define<IUserInstance, IUserModel>('users', {
    user_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: STRING(254), allowNull: false, unique: true },
    name: { type: STRING(64), allowNull: false },
    user_class: { type: SMALLINT, allowNull: false, defaultValue: 0 },
    salt: { type: STRING(32) },
    hash: { type: STRING(128) },
    github: { type: STRING },
    google: { type: STRING },
    facebook: { type: STRING },
});
