import { UserModel, Users } from '../models/UserModel';
import { Logger } from '../util/Logger';
import * as BPromise from 'bluebird';
import { printAndThrowError } from '../util/common';
import { can, Action, Target } from '../util/Permissions';
import { io } from '../app';
import { dataStore } from '../store/DataStore';

const logger = Logger('controllers/UserService');

export interface User extends UserModel {
    can(action: Action, target?: Target): boolean;
}

function applyPrototypeFunctions(user: UserModel | undefined):
    User | undefined {
    return user ? Object.setPrototypeOf(user, { can }) : undefined;
}

export class UserService {

    public static find(): BPromise<UserModel[]> {
        return Users.findAll()
            .then((users) => users.map((user) => user.toJSON()))
            .then((users) => users.map((user) =>
                applyPrototypeFunctions(user)!))
            .catch(printAndThrowError('find', logger));
    }

    public static findById(id: number): BPromise<User | undefined> {
        return Users.findById(id)
            .then((user) => user ? user.toJSON() : undefined)
            .then(applyPrototypeFunctions)
            .catch(printAndThrowError('findById', logger));
    }

    public static findByEmail(email: string): BPromise<User | undefined> {
        return Users.findOne({ where: { email } })
            .then((user) => user ? user.toJSON() : undefined)
            .then(applyPrototypeFunctions)
            .catch(printAndThrowError('findByEmail', logger));
    }

    public static async create(user: UserModel): Promise<User | undefined> {
        const newUser = await Users.create(user, {
            returning: true,
        });

        const newUserJSON = newUser.toJSON();

        if (newUserJSON) {
            dataStore.users[newUserJSON.user_id!] = newUserJSON;

            io.to('authenticated').emit('add_user', {
                user_id: newUserJSON.user_id!,
                email: newUserJSON.email,
                name: newUserJSON.name,
                user_class: newUserJSON.user_class,
            });
        }

        return applyPrototypeFunctions(newUserJSON);
    }

    public static update(id: number,
                         user: Partial<UserModel>):
        BPromise<UserModel | undefined> {

        return Users.update(user as UserModel,
            { where: { user_id: id }, returning: true })
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

    public static delete(id: number): BPromise<void> {
        return Users.destroy({ where: { user_id: id } })
            .then((num) => {
                if (num === 0) {
                    throw new Error('No rows deleted');
                } else if (num > 1) {
                    throw new Error('More than one row deleted');
                }
            }).catch(printAndThrowError('delete', logger));
    }

    public static isEmpty(): BPromise<boolean> {
        return Users.count()
            .then((num) => num === 0)
            .catch(printAndThrowError('isEmpty', logger));
    }
}
