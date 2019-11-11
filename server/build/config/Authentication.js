"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const passport_local_1 = require("passport-local");
const Logger_1 = __importDefault(require("../util/Logger"));
const Database_1 = __importDefault(require("./Database"));
const User_1 = require("../entity/User");
class Authentication {
    static setupStrategies() {
        this.strategies.push(new passport_local_1.Strategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        }, async (req, email, password, done) => {
            const connection = Database_1.default.getConnection();
            if (req.path.match(/\/signup$/i)) {
                const name = req.body.name.trim();
                const company = req.body.company.trim();
                if (!name || !email || !password) {
                    Logger_1.default.error('Attempted local account signup - Fields left blank');
                    return done(undefined, false);
                }
                const { salt, hash } = await this.hashPassword(password);
                const user = await connection.manager.findOne(User_1.User, { email });
                if (!user) {
                    const newUser = new User_1.User();
                    newUser.name = name;
                    newUser.email = email;
                    newUser.role = await connection.manager.count(User_1.User) === 0
                        ? User_1.UserRole.Owner
                        : User_1.UserRole.Pending;
                    newUser.tags = [];
                    newUser.company = company;
                    newUser.salt = salt;
                    newUser.hash = hash;
                    return done(undefined, await connection.manager.save(newUser));
                }
                else {
                    Logger_1.default.error('Attempted local account signup - Email already in use');
                    return done(undefined, false);
                }
            }
            else {
                const user = await connection.manager.findOne(User_1.User, { email });
                if (user) {
                    const hash = await this.pbkdf2Async(password, Buffer.from(user.salt, 'hex'), 3000, 128, 'sha256');
                    if (hash.toString('hex') === user.hash) {
                        done(undefined, user);
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
        const connection = Database_1.default.getConnection();
        try {
            const user = await connection.manager.findOne(User_1.User, id);
            done(undefined, user ? user : undefined);
        }
        catch (err) {
            done(err);
        }
    }
    static async hashPassword(password) {
        const salt = crypto_1.randomBytes(32);
        const hash = await this.pbkdf2Async(password, salt, 3000, 128, 'sha256');
        return { salt: salt.toString('hex'), hash: hash.toString('hex') };
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
}
Authentication.strategies = [];
exports.default = Authentication;
