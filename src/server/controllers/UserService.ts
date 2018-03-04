import { UserModel, Users } from '../models/UserModel';
import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';
import { printAndThrowError } from '../util/common';
import { can, Action, Target } from '../util/Permissions';

const logger = Logger('controllers/UserService');

export interface User extends UserModel {
    can(action: Action, target?: Target): boolean;
}

function applyPrototypeFunctions(user: UserModel | undefined):
    User | undefined {
    return user ? Object.setPrototypeOf(user, { can }) : undefined;
}

export class UserService {

    public static find(): Promise<UserModel[]> {
        return Users.sync()
            .then(() => Users.findAll())
            .then((users) => users.map((user) => user.toJSON()))
            .then((users) => users.map((user) =>
                applyPrototypeFunctions(user)!))
            .catch(printAndThrowError('find', logger));
    }

    public static findById(id: number): Promise<User | undefined> {
        return Users.sync()
            .then(() => Users.findById(id))
            .then((user) => user ? user.toJSON() : undefined)
            .then(applyPrototypeFunctions)
            .catch(printAndThrowError('findById', logger));
    }

    public static findByEmail(email: string): Promise<User | undefined> {
        return Users.sync()
            .then(() => Users.findOne({ where: { email } }))
            .then((user) => user ? user.toJSON() : undefined)
            .then(applyPrototypeFunctions)
            .catch(printAndThrowError('findByEmail', logger));
    }

    public static create(user: UserModel): Promise<User | undefined> {
        return Users.sync()
            .then(() => Users.create(user))
            .then((newUser) => newUser.toJSON())
            .then(applyPrototypeFunctions)
            .catch(printAndThrowError('create', logger));
    }

    public static update(id: number,
                         user: Partial<UserModel>):
        Promise<UserModel | undefined> {

        return Users.sync()
            .then(() => Users.update(user as UserModel,
                { where: { user_id: id }, returning: true }))
            .then((val) => {
                const [num, users] = val;
                if (num === 0) {
                    logger.error('update id matched no existing user');
                    return undefined;
                } else if (num > 1) {
                    throw new Error('Update query modified more than one user');
                }
                return users[0]!.toJSON();
            })
            .then((userObj) => Object.setPrototypeOf(userObj, { can }))
            .catch(printAndThrowError('update', logger));
    }

    public static delete(id: number): Promise<void> {
        return Users.sync()
            .then(() => Users.destroy({ where: { user_id: id } }))
            .then((num) => {
                if (num === 0) {
                    throw new Error('No rows deleted');
                } else if (num > 1) {
                    throw new Error('More than one row deleted');
                }
            }).catch(printAndThrowError('delete', logger));
    }

    public static isEmpty(): Promise<boolean> {
        return Users.sync()
            .then(() => Users.count())
            .then((num) => num === 0)
            .catch(printAndThrowError('isEmpty', logger));
    }
}
