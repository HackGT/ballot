import { IUserModel, Users } from '../models/UserModel';
// import { query } from '../db';
import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';

const logger = Logger('controllers/UserService');

export class UserService {

    public static find(): Promise<IUserModel[]> {
        return Users.sync()
            .then(() => Users.findAll())
            .then((users) => users.map((user) => user.toJSON()))
            .catch((err) => {
                logger.error('find failed with: ', err);
                return [];
            });
    }

    public static findById(id: number): Promise<IUserModel | undefined> {
        return Users.sync()
            .then(() => Users.findById(id))
            .then((user) => user ? user.toJSON() : undefined)
            .catch((err) => {
                logger.error('findById failed with: ', err);
                return undefined;
            });
    }

    public static findByEmail(email: string): Promise<IUserModel | undefined> {
        return Users.sync()
            .then(() => Users.findOne({ where: { email } }))
            .then((user) => user ? user.toJSON() : undefined)
            .catch((err) => {
                logger.error('findByEmail failed with: ', err);
                return undefined;
            });
    }

    public static create(user: IUserModel): Promise<IUserModel | undefined> {
        // TODO: user validation

        return Users.sync()
            .then(() => Users.create(user))
            .then((newUser) => newUser.toJSON())
            .catch((err) => {
                logger.error('create failed with: ', err);
                return undefined;
            });
    }

    public static update(id: number, user: any): Promise<IUserModel | undefined> {

        return Users.sync()
            .then(() => Users.update(user, { where: { user_id: id }, returning: true }))
            .then(val => {
                const [num, users] = val;
                if (num === 0) {
                    logger.error('update id matched no existing user');
                    return undefined;
                } else if (num > 1) {
                    logger.error('updated too many users');
                    return undefined;
                }
                return users[0]!.toJSON();
            }).catch((err) => {
                logger.error('update failed with: ', err);
                return undefined;
            });
    }

    public static delete(id: number): Promise<void> {
        return Users.sync()
            .then(() => Users.destroy({ where: { user_id: id } }))
            .then((num) => {
                if (num === 0) {
                    logger.error('delete deleted no rows');
                    throw new Error('No rows deleted');
                } else if (num > 1) {
                    logger.error('delete deleted more than one row');
                    throw new Error('More than one row deleted');
                }
            });
    }

    public static isEmpty(): Promise<boolean> {
        return Users.sync()
            .then(() => Users.count())
            .then((num) => num === 0)
            .catch((err) => {
                logger.error('isEmpty failed with: ', err);
                return false;
            });
    }
}
