import { IUserModel, Users } from '../models/UserModel';
import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';
import { printAndThrowError } from '../util/common';

const logger = Logger('controllers/UserService');

export class UserService {

    public static find(): Promise<IUserModel[]> {
        return Users.sync()
            .then(() => Users.findAll())
            .then((users) => users.map((user) => user.toJSON()))
            .catch(printAndThrowError('find', logger));
    }

    public static findById(id: number): Promise<IUserModel | undefined> {
        return Users.sync()
            .then(() => Users.findById(id))
            .then((user) => user ? user.toJSON() : undefined)
            .catch(printAndThrowError('findById', logger));
    }

    public static findByEmail(email: string): Promise<IUserModel | undefined> {
        return Users.sync()
            .then(() => Users.findOne({ where: { email } }))
            .then((user) => user ? user.toJSON() : undefined)
            .catch(printAndThrowError('findByEmail', logger));
    }

    public static create(user: IUserModel): Promise<IUserModel | undefined> {
        return Users.sync()
            .then(() => Users.create(user))
            .then((newUser) => newUser.toJSON())
            .catch(printAndThrowError('create', logger));
    }

    public static update(id: number,
                         user: Partial<IUserModel>):
                         Promise<IUserModel | undefined> {

        return Users.sync()
            .then(() => Users.update(user as IUserModel,
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
            }).catch(printAndThrowError('update', logger));
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
