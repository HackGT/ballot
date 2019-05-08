"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("../model/User"));
const Permissions_1 = require("../config/Permissions");
const Logger_1 = __importDefault(require("../util/Logger"));
class Authentication {
    static setupStrategies() {
        this.strategies.push(new passport_local_1.Strategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        }, async (req, email, password, done) => {
            let users = await User_1.default.query().where('email', email);
            if (req.path.match(/\/signup$/i)) {
                const name = req.body.name.trim();
                if (!name || !email || !password) {
                    Logger_1.default.error('Attempted local account signup - Fields left blank');
                    return done(undefined, false);
                }
                const { salt, hash } = await this.hashPassword(password);
                let user;
                if ((await User_1.default.query()).length === 0) {
                    user = await User_1.default.query().insert({
                        name,
                        email,
                        role: Permissions_1.Role.Owner,
                        salt,
                        hash,
                    });
                    return done(undefined, user);
                }
                else {
                    if (users.length === 0) {
                        user = await User_1.default.query().insert({
                            name,
                            email,
                            role: Permissions_1.Role.Pending,
                            salt,
                            hash,
                        });
                        return done(undefined, user);
                    }
                    else {
                        Logger_1.default.error('Attempted local account signup - Email already in use');
                        return done(undefined, false);
                    }
                }
            }
            else if (users[0]) {
                const actualUser = users[0];
                const hash = await this.pbkdf2Async(password, Buffer.from(actualUser.salt, 'hex'), 3000, 128, 'sha256');
                if (hash.toString('hex') === actualUser.hash) {
                    done(undefined, actualUser);
                }
                else {
                    Logger_1.default.error('Attempted local account login - Incorrect credentials');
                    done(undefined, false);
                }
            }
            else {
                Logger_1.default.error('Attempted local account login - User does not exist');
                done(undefined, false);
            }
        }));
    }
    static getStrategies() {
        return this.strategies;
    }
    static serialize(user, done) {
        done(undefined, user.id);
    }
    static async deserialize(id, done) {
        try {
            done(undefined, await User_1.default.query().findById(id));
        }
        catch (err) {
            done(err);
        }
        ;
    }
    static pbkdf2Async(password, salt, iterations, keyLength, digest) {
        return new Promise((resolve, reject) => {
            crypto_1.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(derivedKey);
            });
        });
    }
    static async hashPassword(password) {
        const salt = crypto_1.randomBytes(32);
        const hash = await this.pbkdf2Async(password, salt, 3000, 128, 'sha256');
        return { salt: salt.toString('hex'), hash: hash.toString('hex') };
    }
}
Authentication.strategies = [];
exports.default = Authentication;
