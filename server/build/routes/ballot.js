"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Permissions_1 = require("../config/Permissions");
const BallotController_1 = __importDefault(require("../controllers/BallotController"));
const router = express_1.Router();
router.get('/allBallots', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewBallot)) {
        return res.status(200).json(await BallotController_1.default.getAllBallots());
    }
    return res.status(401).send('Not enough permissions to view ballots.');
});
exports.default = router;
