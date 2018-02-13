import { IUserModel } from '../models/UserModel';
import { query } from '../db';
import { Logger } from '../util/Logger';

const logger = Logger('controllers/UserService');

export class UserService {

    public static find(): Promise<IUserModel[] | undefined> {
        return query(`SELECT * FROM users`)
            .then((res) => {
                logger.info('Listing all users');
                return res.rows as IUserModel[];
            }).catch((err) => {
                logger.error('Find Failed with: ', err);
                return undefined;
            });
    }

    public static findById(id: string): Promise<IUserModel | undefined> {
        return query(`SELECT * FROM users WHERE userid='${id}'`)
            .then((res) => {
                logger.info('Searching for user: ', id);
                if (res.rows.length === 0) {
                    return undefined;
                }
                return res.rows[0] as IUserModel;
            }).catch((err) => {
                logger.error('FindById Failed with: ', err);
                return undefined;
            });
    }

    public static findByEmail(email: string, service?: string): Promise<IUserModel | undefined> {
        let querystr = `SELECT * FROM users WHERE email='${email}'`;
        if (service) {
            querystr += `, service='${service}'`;
        }

        return query(querystr)
            .then((res) => {
                logger.info('Searching for user: ', email);
                if (res.rows.length === 0) {
                    return undefined;
                }
                return res.rows[0] as IUserModel;
            }).catch((err) => {
                logger.error('FindByEmail Failed with: ', err);
                return undefined;
            });
    }

    public static create(user: IUserModel): Promise<IUserModel | undefined> {
        // TODO: user validation

        return query(`INSERT INTO users(email, name, userClass, hash, salt)
                        VALUES('${user.email}', '${user.name}', ${user.userClass}, '', '')`)
            .then((res) => {
                logger.info('Creating user: ', user.email);
                return user;
            }).catch(err => {
                logger.error('Create Failed with: ', err);
                return undefined;
            });
    }

    public static update(email: string, user: any): Promise<IUserModel | undefined> {
        // TODO: user validation

        // build 'SET' query
        let updateStr = '';
        for (const key of ['email', 'name', 'userClass']) {
            if (user[key]) {
                updateStr += `${key}='${user[key]}', `;
            }
        }

        // Remove the extra comma and space
        if (updateStr.length !== 0) {
            updateStr = updateStr.substring(0, updateStr.length - 2);
        } else {
            throw new Error('user should have valid attributes to be updated');
        }

        return query(`UPDATE users
                        SET ${updateStr}
                        WHERE email='${email}'`)
            .then((res) => {
                logger.info('Updating user: ', email);
                return user;
            }).catch((err) => {
                logger.error('Updated Failed with: ', err);
                return undefined;
            });
    }

    public static delete(email: string): Promise<void> {
        return query(`DELETE FROM users WHERE email='${email}'`)
            .then((res) => {
                logger.info('Deleting user: ', email);
            }).catch((err) => {
                logger.error('Delete failed with: ', err);
            });
    }

    public static isEmpty(): Promise<boolean> {
        return query('SELECT count(*) FROM (SELECT 1 FROM users LIMIT 1)')
            .then((res) => {
                console.log(res);
                return true;
            }).catch((err) => {
                logger.error('isEmpty query failed with: ', err);
                return false;
            });
    }
}
