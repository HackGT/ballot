"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const Permissions_1 = require("../config/Permissions");
const express_1 = require("express");
const Project_1 = __importDefault(require("../model/Project"));
const postParser = bodyParser.urlencoded({
    extended: false,
});
const router = express_1.Router();
router.get('/projects', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewProjects)) {
        const projects = await Project_1.default.query().select([
            'id', 'name', 'devpostURL', 'expoNumber', 'tableGroup', 'tableNumber',
            'sponsorPrizes',
        ]);
        return res.status(200).json({
            projects,
        });
    }
    return res.status(401).send('Unauthorized');
});
router.put('/projects', postParser, async (req, res) => {
    try {
        if (Permissions_1.can(req.user, Permissions_1.Action.AddProject)) {
            const project = await Project_1.default.query().insert({
                name: req.body.name,
                devpostURL: req.body.devpostURL,
                expoNumber: req.body.expoNumber,
                tableGroup: req.body.tableGroup,
                tableNumber: req.body.tableNumber,
                sponsorPrizes: req.body.sponsorPrizes,
                tags: req.body.tags,
            });
            return res.status(200).json(project);
        }
    }
    catch (err) {
        return res.status(400).send('Error');
    }
    return res.status(400).send('Error');
});
router.post('/projects/:id', postParser);
router.delete('/projects/:id');
