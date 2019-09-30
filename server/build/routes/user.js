"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const Permissions_1 = require("../config/Permissions");
const router = express_1.Router();
router.get('/allUsers', async (req, res) => {
    console.log(req.user);
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewUsers)) {
        return res.status(200).json(await UserController_1.default.getAllUsersSafe());
    }
    return res.status(401).send('Not enough permissions to view users.');
});
router.post('/update', async (req, res) => {
    console.log(req.body);
    if (Permissions_1.can(req.user, Permissions_1.Action.EditUser)) {
        return res.status(200).json(await UserController_1.default.updateUser(req.body.user));
    }
    return res.status(401).send('Not enough permissions to edit or create users.');
});
exports.default = router;
