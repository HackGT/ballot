"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const passport_local_1 = require("passport-local");
const Logger_1 = __importDefault(require("../util/Logger"));
const user_model_1 = __importStar(require("../model/user.model"));
class Authentication {
    static setupStrategies() {
        this.strategies.push(new passport_local_1.Strategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        }, async (req, email, password, done) => {
            if (req.path.match(/\/signup$/i)) {
                const name = req.body.name.trim();
                if (!name || !email || !password) {
                    Logger_1.default.error('Attempted local account signup - Fields left blank');
                    return done(undefined, false);
                }
                const { salt, hash } = await this.hashPassword(password);
                const user = user_model_1.default.findOne({ email: email });
                if (!user) {
                    const newUser = await user_model_1.default.create({
                        name,
                        email,
                        role: await user_model_1.default.count({}) === 0 ? user_model_1.UserRole.Owner : user_model_1.UserRole.Pending,
                        salt,
                        hash,
                    });
                    return done(undefined, newUser);
                }
                else {
                    Logger_1.default.error('Attempted local account signup - Email already in use');
                    return done(undefined, false);
                }
            }
            else {
                const user = await user_model_1.default.findOne({ email: email });
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
        try {
            const user = await user_model_1.default.findById(id);
            done(undefined, user ? user : undefined);
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
