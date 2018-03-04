import { sequelize } from '../db/index';
import * as Sequelize from 'sequelize';

// Catch-all import because we want SequelizeStatic.Model and not
// Sequelize.Model
const { INTEGER, STRING, ENUM } = Sequelize;

export interface UserModel {
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

interface UserInstance extends Sequelize.Instance<UserModel> {
}

export enum UserClass {
    Pending = 'Pending',
    Judge = 'Judge',
    Admin = 'Admin',
    Owner = 'Owner',
}

export const Users: Sequelize.Model<UserInstance, UserModel> =
    sequelize.define<UserInstance, UserModel>('users', {
        user_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        email: {
            type: STRING(254),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        name: { type: STRING(64), allowNull: false },
        user_class: {
            type: ENUM('Pending', 'Judge', 'Admin', 'Owner'),
            allowNull: false, defaultValue: 'Pending',
        },
        salt: { type: STRING(64) },
        hash: { type: STRING(256) },
        github: { type: STRING },
        google: { type: STRING },
        facebook: { type: STRING },
    });
