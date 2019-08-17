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
const express_1 = require("express");
const Permissions_1 = require("../config/Permissions");
const user_1 = __importDefault(require("../routes/user"));
const category_1 = __importDefault(require("../routes/category"));
const tablegroup_1 = __importDefault(require("../routes/tablegroup"));
const postParser = bodyParser.urlencoded({
    extended: false,
});
const router = express_1.Router();
router.use('/users', user_1.default);
router.use('/categories', category_1.default);
router.use('/tableGroups', tablegroup_1.default);
router.get('/projects', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewProjects)) {
    }
    return res.status(401).send('Unauthorized');
});
router.put('/projects', postParser, async (req, res) => {
    try {
        if (Permissions_1.can(req.user, Permissions_1.Action.AddProject)) {
            return res.status(200).send('Success');
        }
    }
    catch (err) {
        return res.status(400).send('Error');
    }
    return res.status(400).send('Error');
});
router.post('/projects', async (req, res) => {
});
router.delete('/projects/:id', (req, res) => {
});
router.get('/categories', async (req, res) => {
    return res.status(400).send('Unauthorized');
});
router.get('/categories/:id', async (req, res) => {
    const idRequested = req.params.id;
    return res.status(400).send('Unauthorized');
});
router.post('/categories', async (req, res) => {
    console.log(req.body);
    if (Permissions_1.can(req.user, Permissions_1.Action.UpdateCategory)) {
    }
    return res.status(401).send('Unauthorized');
});
router.delete('/categories/:id', async (req, res) => {
    const idRequested = req.params.id;
    console.log(idRequested);
    return res.status(401).send('Unauthorized');
});
router.delete('/criteria/:id', async (req, res) => {
    const idRequested = req.params.id;
    return res.status(401).send('Unauthorized');
});
exports.default = router;
