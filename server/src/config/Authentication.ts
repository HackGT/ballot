import { pbkdf2, randomBytes } from 'crypto';
import { Strategy } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request } from 'express';
import Logger from '../util/Logger';
import Database from './Database';
import { User, UserRole } from '../entity/User';

export default class Authentication {
    public static setupStrategies() {
        this.strategies.push(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        }, async (req: Request, email: string, password: string, done: (err: any, user?: any) => void) => {
            const connection = Database.getConnection();

            // Check the request is a request to register.
            if (req.path.match(/\/signup$/i)) {
                const name = req.body.name.trim();
                if (!name || !email || !password) {
                    Logger.error('Attempted local account signup - Fields left blank');
                    return done(undefined, false);
                }
                const { salt, hash } = await this.hashPassword(password);

                const user = await connection.manager.findOne(User, { email });
                if (!user) {
                    // User does not exist, so create a user.
                    const newUser = new User();
                    newUser.name = name;
                    newUser.email = email;
                    newUser.role = await connection.manager.count(User) === 0
                        ? UserRole.Owner
                        : UserRole.Pending;
                    newUser.tags = [];
                    newUser.salt = salt;
                    newUser.hash = hash;

                    return done(undefined, await connection.manager.save(newUser));
                } else {
                    // User exists, so don't create a user.
                    Logger.error('Attempted local account signup - Email already in use');
                    return done(undefined, false);
                }
            // This is a request to log in.
            } else {
                const user = await connection.manager.findOne(User, { email });
                if (user) {
                    const hash = await this.pbkdf2Async(
                        password,
                        Buffer.from(user.salt as string, 'hex'),
                        3000,
                        128,
                        'sha256',
                    );
                    if (hash.toString('hex') === user.hash) {
                        done(undefined, user);
                    } else {
                        Logger.error('Attempted local account login - Incorrect credentials');
                        done(undefined, false);
                    }
                } else {
                    Logger.error('Attempted local account login - User does not exist');
                    done(undefined, false);
                }
            }
        }));
    }

    public static getStrategies() {
        return this.strategies;
    }

    public static serialize(user: User, done: (err: any, id?: number) => void): void {
        done(undefined, user.id);
    }

    public static async deserialize(id: number, done: (err: any, user?: User) => void): Promise<void> {
        const connection = Database.getConnection();
        try {
            const user = await connection.manager.findOne(User, id);
            done(undefined, user ? user : undefined);
        } catch (err) {
            done(err);
        }
    }

    public static async hashPassword(password: string): Promise<{ salt: string, hash: string }> {
        const salt = randomBytes(32);
        const hash = await this.pbkdf2Async(password, salt, 3000, 128, 'sha256');

        return { salt: salt.toString('hex'), hash: hash.toString('hex') };
    }

    private static strategies: Strategy[] = [];

    private static pbkdf2Async(
        password: string | Buffer,
        salt: string | Buffer,
        iterations: number,
        keyLength: number,
        digest: string,
    ): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            pbkdf2(password, salt, iterations, keyLength, digest, (err: Error, derivedKey: Buffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(derivedKey);
            });
        });
    }
}
