"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Permissions_1 = require("../config/Permissions");
const ProjectController_1 = __importDefault(require("../controllers/ProjectController"));
const router = express_1.Router();
router.get('/allProjects', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewProjects)) {
        return res.status(200).json(await ProjectController_1.default.getAllProjects());
    }
    return res.status(401).send('Not enough permissions to view projects.');
});
router.post('/upload', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.BatchUploadProjects)) {
        return res.status(200).json(await ProjectController_1.default.batchUploadProjects(req.body.projects));
    }
    return res.status(401).send('Not enough permissions to upload projects.');
});
exports.default = router;
