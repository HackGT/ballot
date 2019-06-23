import { pbkdf2, randomBytes } from 'crypto';
import chalk from 'chalk';
import { Strategy, Profile } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request } from 'express';
import { Role } from '../config/Permissions';
import Logger from '../util/Logger';
import Database from './Database';
import User, { UserRole, IUser } from '../model/user.model';

export default class Authentication {
    private static strategies: Strategy[] = [];

    public static setupStrategies() {
        this.strategies.push(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        }, async (req: Request, email: string, password: string, done: (err: any, user?: any) => void) => {
            // Check the request is a request to register.
            if (req.path.match(/\/signup$/i)) {
                const name = req.body.name.trim();
                if (!name || !email || !password) {
                    Logger.error('Attempted local account signup - Fields left blank');
                    return done(undefined, false);
                }
                const { salt, hash } = await this.hashPassword(password);

                const user = User.findOne({ email: email})
                if (!user) {
                    // User does not exist, so create a user.
                    const newUser = await User.create({
                        name,
                        email,
                        // If this is the first user, make them an owner.
                        role: await User.count({}) === 0 ? UserRole.Owner : UserRole.Pending,
                        salt,
                        hash,
                    });
                    return done(undefined, newUser);
                } else {
                    // User exists, so don't create a user.
                    Logger.error('Attempted local account signup - Email already in use');
                    return done(undefined, false);
                }
            // This is a request to log in.
            } else {
                const user = await User.findOne({ email: email });
                if (user) {
                    const hash = await this.pbkdf2Async(password, Buffer.from(user.salt as string, 'hex'), 3000, 128, 'sha256');
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

    public static serialize(user: IUser, done: (err: any, id?: number) => void): void {
        done(undefined, user.id);
    }

    public static async deserialize(id: number, done: (err: any, user?: IUser) => void): Promise<void> {
        try {
            const user = await User.findById(id);
            done(undefined, user ? user : undefined);
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

