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
router.post('/nextProject', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ScoreBallot)) {
        return res.status(200).json(await ProjectController_1.default.getNextProject(req.body.userID));
    }
    return res.status(401).send('Not enough permissions to get next project');
});
router.post('/startProject', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ScoreBallot)) {
        return res.status(200).json(await ProjectController_1.default.startProject(req.body.userID, req.body.projectID));
    }
    return res.status(401).send('Not enough permissions to start project.');
});
router.post('/scoreProject', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ScoreBallot)) {
        return res.status(200).json(await ProjectController_1.default.scoreProject(req.body.ballots));
    }
    return res.status(401).send('Not enough permissions to score project');
});
router.post('/skip', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ScoreBallot)) {
        return res.status(200).json(await ProjectController_1.default.skipProject(req.body.userID, req.body.projectID));
    }
    return res.status(401).send('Not enough permissions to skip project');
});
router.post('/busy', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ScoreBallot)) {
        return res.status(200).json(await ProjectController_1.default.projectBusy(req.body.userID, req.body.projectID));
    }
    return res.status(401).send('Not enough permissions to mark project as busy');
});
router.post('/missing', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ScoreBallot)) {
        return res.status(200).json(await ProjectController_1.default.projectMissing(req.body.userID, req.body.projectID));
    }
    return res.status(401).send('Not enough permissions to mark project as missing');
});
exports.default = router;
