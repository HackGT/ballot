import { Environment } from './Environment';
import { Logger } from '../util/Logger';
import { Strategy as GitHubStrategy, Profile as GithubProfile } from 'passport-github2';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy, Profile } from 'passport';
import { UserService } from '../controllers/UserService';
import { UserClass, IUserModel } from '../models/UserModel';
import { Request } from 'express';
import * as crypto from 'crypto';
import { pbkdf2Async } from '../util/common';

const logger = Logger('config/auth');

export const strategies: Strategy[] = [];

// Github
const githubConfig = Environment.getGithubAuth();
addStrategy('github',
    githubConfig,
    GitHubStrategy);

// Google
const googleConfig = Environment.getGoogleAuth();
addStrategy('google',
    googleConfig,
    GoogleStrategy);

// Facebook
const facebookConfig = Environment.getFacebookAuth();
addStrategy('facebook',
    facebookConfig,
    FacebookStrategy);

// Local
if (Environment.allowLocalAuth()) {
    logger.info('Local envars found, enabling Local Authentication');
    strategies.push(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req: Request, email: string, password: string, done: (error: any, user?: any) => void) => {
            let user = await UserService.findByEmail(email);

            if (req.path.match(/\/signup$/i)) {
                const isEmpty = await UserService.isEmpty();

                const name = req.body.name.trim();

                if (!name || !email || !password) {
                    // TODO: display this issue using express.flash middleware
                    logger.error(`Attempted local account signup - Missing name, email, password`);
                    return done(undefined, false);
                }

                const salt = crypto.randomBytes(32);
                const hash = await pbkdf2Async(password, salt, 3000);


                if (isEmpty) {
                    user = await UserService.create({
                        name,
                        email,
                        userClass: UserClass.Owner,
                        salt: salt.toString('hex'),
                        hash: hash.toString('hex'),
                        service: 'local',
                    });
                } else {
                    if (user === undefined) {
                        user = await UserService.create({
                            name,
                            email,
                            userClass: UserClass.Pending,
                            salt: salt.toString('hex'),
                            hash: hash.toString('hex'),
                            service: 'local',
                        });
                    } else {
                        // TODO: display this issue using express.flash middleware
                        logger.error(`attempted local account signup - email already taken`);
                        return done(undefined, false);
                    }
                }
            } else {
                if (!user || !user.salt || !user.hash || user.service !== 'local') {
                    // TODO: display this issue using express.flash middleware
                    logger.error(`Attempted local account sign in - Wrong service`);
                    return done(undefined, false);
                }
                const hash = await pbkdf2Async(password, Buffer.from(user.salt as string, 'hex'), 3000);
                if (hash.toString('hex') === user.hash) {
                    done(undefined, user);
                } else {
                    // TODO: display this issue using express.flash middleware
                    logger.error(`Attempted local acccount sign in - Wrong password`);
                    done(undefined, user);
                }
            }
        }));
} else {
    logger.warn('No Local Authentication envars found.');
}

function addStrategy(name: string, config: any, strategy: any): void {
    if (config) {
        logger.info(`${name} envars found, enabling ${name} Authentication`);
        strategies.push(
            new strategy(config,
                async (accessToken: string, refreshToken: string, profile: GithubProfile, done: (error: any, user?: any) => void) => {
                    if (profile.emails === undefined) {
                        // TODO: display this issue using express.flash middleware
                        logger.error(`${name} Login attempt without public email in ${name} profile`);
                        return done(undefined, false);
                    } else if (profile.displayName === undefined || profile.displayName.trim() === '') {
                        // TODO: display this issue using express.flash middleware
                        logger.error(`${name} Login attempt without a display name in ${name} profile`);
                        return done(undefined, false);
                    }
                    const isEmpty = await UserService.isEmpty();
                    let user;
                    // First user will be the application 'Owner'
                    if (isEmpty) {
                        user = await UserService.create({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            userClass: UserClass.Owner,
                            service: name,
                        });
                    } else {
                        user = await UserService.findByEmail(profile.emails[0].value);
                        // Any other new user will need to be approved
                        if (user === undefined) {
                            user = await UserService.create({
                                name: profile.displayName,
                                email: profile.emails[0].value,
                                userClass: 0,
                                service: name,
                            });
                        } else if (user.service !== name) {
                            // TODO: display this issue using express.flash middleware
                            logger.error(`${name} Login attempted for an account already created through ${user.service}`);
                            return done(undefined, false);
                        }
                    }

                    done(undefined, user);
                }
            )
        );
    } else {
        logger.warn(`No ${name} Authentication envars found. Skipping.`);
    }
}

export function serialize(user: IUserModel, done: (err: any, id?: string) => void): void {
    done(undefined, user.userId);
}

export function deserialize(id: string, done: (err: any, user?: IUserModel) => void): void {
    UserService.findById(id).then((user) => {
        done(undefined, user);
    }).catch((err) => {
        done(err);
    });
}
