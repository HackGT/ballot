import { pbkdf2, randomBytes } from 'crypto';
import chalk from 'chalk';
import { Strategy, Profile } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request } from 'express';
import User from '../model/User';
import { Role } from '../config/Permissions';
import Logger from '../util/Logger';

export default class Authentication {
    private static strategies: Strategy[] = [];

    public static setupStrategies() {
        this.strategies.push(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        }, async (req: Request, email: string, password: string, done: (err: any, user?: any) => void) => {
            let users = await User.query().where('email', email);

            // Check the request is a request to register.
            if (req.path.match(/\/signup$/i)) {
                const name = req.body.name.trim();

                if (!name || !email || !password) {
                    Logger.error('Attempted local account signup - Fields left blank');
                    return done(undefined, false);
                }

                const { salt, hash } = await this.hashPassword(password);

                let user: User;

                // No users exist, so first user should be an owner.
                if ((await User.query()).length === 0) {
                    user = await User.query().insert({
                        name,
                        email,
                        role: Role.Owner,
                        salt,
                        hash,
                    });

                    return done(undefined, user);
                } else {
                    // User does not currently exist.
                    if (users.length === 0) {
                        user = await User.query().insert({
                            name,
                            email,
                            role: Role.Pending,
                            salt,
                            hash,
                        });

                        // console.log(user);

                        return done(undefined, user);
                    } else {
                        Logger.error('Attempted local account signup - Email already in use');
                        return done(undefined, false);
                    }
                }
            } else if (users[0]) {
                // User exists
                const actualUser = users[0];
                // console.log(actualUser);
                const hash = await this.pbkdf2Async(password, Buffer.from(actualUser.salt as string, 'hex'), 3000, 128, 'sha256');
                if (hash.toString('hex') === actualUser.hash) {
                    done(undefined, actualUser);
                } else {
                    Logger.error('Attempted local account login - Incorrect credentials');
                    done(undefined, false);
                }
            } else {
                Logger.error('Attempted local account login - User does not exist');
                done(undefined, false);
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
        try {
            done(undefined, await User.query().findById(id));
        } catch (err) {
            done(err);
        };
    }

    private static pbkdf2Async(
        password: string | Buffer,
        salt: string | Buffer,
        iterations: number,
        keyLength: number,
        digest: string
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

    public static async hashPassword(password: string): Promise<{ salt: string, hash: string }> {
        const salt = randomBytes(32);
        const hash = await this.pbkdf2Async(password, salt, 3000, 128, 'sha256');

        return { salt: salt.toString('hex'), hash: hash.toString('hex') };
    }
}

