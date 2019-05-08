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
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const bodyParser = __importStar(require("body-parser"));
const postParser = bodyParser.urlencoded({
    extended: false,
});
const router = express_1.Router();
router.get('/user_data', (req, res) => {
    if (req.user === undefined) {
        return res.status(200).json({});
    }
    else {
        return res.status(200).json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            tags: req.user.tags,
        });
    }
});
router.get('/logout', (req, res) => {
    req.logout();
    return res.status(200).json({
        user_id: null,
    });
});
router.post('/login', postParser, (req, res, next) => {
    passport_1.default.authenticate('local', (error, user) => {
        console.log(user);
        if (user) {
            req.logIn(user, () => {
                return res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    tags: user.tags,
                });
            });
        }
        else {
            return res.json({
                id: null,
            });
        }
        return null;
    })(req, res, next);
});
router.post('/signup', postParser, (req, res, next) => {
    passport_1.default.authenticate('local', (error, user) => {
        console.log('signup', user);
        if (user) {
            return res.status(200).json({
                status: true,
            });
        }
        else {
            return res.status(200).json({
                status: false,
            });
        }
    })(req, res, next);
});
exports.default = router;
