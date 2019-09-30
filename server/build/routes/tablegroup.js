"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Permissions_1 = require("../config/Permissions");
const TableGroupController_1 = __importDefault(require("../controllers/TableGroupController"));
const router = express_1.Router();
router.get('/allTableGroups', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewTableGroups)) {
        return res.status(200).json(await TableGroupController_1.default.getAllTableGroups());
    }
    return res.status(401).send('Not enough permissions to manage table groups.');
});
router.post('/update', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ManageTableGroups)) {
        return res.status(200).json(await TableGroupController_1.default.updateTableGroups(req.body.tableGroups));
    }
    return res.status(401).send('Not enough permissions to manage table groups.');
});
exports.default = router;
