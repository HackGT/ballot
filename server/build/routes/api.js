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
const User_1 = __importDefault(require("../model/User"));
const Authentication_1 = __importDefault(require("../config/Authentication"));
const Category_1 = __importDefault(require("../model/Category"));
const Criteria_1 = __importDefault(require("../model/Criteria"));
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
router.post('/projects/:id', postParser, (req, res) => {
});
router.delete('/projects/:id', postParser, (req, res) => {
});
router.get('/users', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewUsers)) {
        const users = await User_1.default.query().select([
            'id', 'name', 'email', 'role', 'tags',
        ]);
        return res.status(200).json({
            users,
        });
    }
    return res.status(401).send('Unauthorized');
});
router.post('/users', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.EditUser)) {
        console.log(req.body);
        if (req.body.id && req.body.name && req.body.role) {
            if (req.body.password) {
                const { salt, hash } = await Authentication_1.default.hashPassword(req.body.password);
                const users = await User_1.default.query().findById(req.body.id).patch({
                    name: req.body.name,
                    role: req.body.role,
                    salt,
                    hash,
                });
                return res.status(200).json({
                    status: true,
                });
            }
            else {
                const users = await User_1.default.query().findById(req.body.id).patch({
                    name: req.body.name,
                    role: req.body.role,
                });
                return res.status(200).json({
                    status: true
                });
            }
        }
    }
    return res.status(401).send('Unauthorized');
});
router.get('/categories', async (req, res) => {
    const [categoryResult, criteriaResult] = await Promise.all([
        await Category_1.default.query().select('id', 'name', 'isDefault'),
        await Criteria_1.default.query().select('id', 'name', 'rubric', 'minScore', 'maxScore', 'categoryID'),
    ]);
    const result = {};
    for (const category of categoryResult) {
        result[category.id] = {
            id: category.id,
            name: category.name,
            isDefault: category.isDefault,
            criteria: [],
        };
    }
    for (const criteria of criteriaResult) {
        result[criteria.categoryID].criteria.push({
            id: criteria.id,
            name: criteria.name,
            rubric: criteria.rubric,
            minScore: criteria.minScore,
            maxScore: criteria.maxScore,
        });
    }
    console.log(result);
    return res.status(200).json(result);
    return res.status(400).send('Unauthorized');
});
router.get('/categories/:id', async (req, res) => {
    const idRequested = req.params.id;
    const [categoryResult, criteriaResult] = await Promise.all([
        await Category_1.default.query().select('id', 'name', 'isDefault').where('id', idRequested),
        await Criteria_1.default.query().select('id', 'name', 'rubric', 'minScore', 'maxScore', 'categoryID').where('categoryID', idRequested),
    ]);
    const result = {};
    for (const category of categoryResult) {
        result[category.id] = {
            id: category.id,
            name: category.name,
            isDefault: category.isDefault,
            criteria: [],
        };
    }
    for (const criteria of criteriaResult) {
        result[criteria.categoryID].criteria.push({
            id: criteria.id,
            name: criteria.name,
            rubric: criteria.rubric,
            minScore: criteria.minScore,
            maxScore: criteria.maxScore,
        });
    }
    console.log(result);
    return res.status(200).json(result);
    return res.status(400).send('Unauthorized');
});
router.post('/categories', async (req, res) => {
    console.log(req.body);
    if (Permissions_1.can(req.user, Permissions_1.Action.UpdateCategory)) {
        if (req.body.id && req.body.name) {
            if (req.body.criteria.length > 0) {
                let updatedCategoryID = req.body.id;
                if (updatedCategoryID < 0) {
                    const category = await Category_1.default.query().insert({
                        name: req.body.name,
                        isDefault: req.body.isDefault,
                    });
                    updatedCategoryID = category.id;
                }
                await Category_1.default.query().findById(req.body.id).patch({
                    name: req.body.name,
                    isDefault: req.body.isDefault,
                });
                try {
                    const newCriteria = req.body.criteria;
                    for (const criteria of newCriteria) {
                        if (criteria.id < 0) {
                            await Criteria_1.default.query().insert({
                                name: criteria.name,
                                rubric: criteria.rubric,
                                minScore: parseInt(criteria.minScore, 10),
                                maxScore: parseInt(criteria.maxScore, 10),
                                categoryID: updatedCategoryID,
                            });
                        }
                        else {
                            await Criteria_1.default.query().findById(criteria.id).patch({
                                name: criteria.name,
                                rubric: criteria.rubric,
                                minScore: criteria.minScore,
                                maxScore: criteria.maxScore,
                                categoryID: updatedCategoryID,
                            });
                        }
                    }
                    return res.status(200).send('Successfully created criteria');
                }
                catch (error) {
                    console.log(error);
                    return res.status(400).send('Error creating criteria');
                }
            }
            else {
                return res.status(400).send('Categories must have at least one criteria');
            }
        }
        else {
            return res.status(400).send('Missing information');
        }
    }
    return res.status(401).send('Unauthorized');
});
router.delete('/categories/:id', async (req, res) => {
    const idRequested = req.params.id;
    console.log(idRequested);
    if (Permissions_1.can(req.user, Permissions_1.Action.DeleteCategory)) {
        if (idRequested) {
            try {
                await Category_1.default.query().deleteById(idRequested);
                await Criteria_1.default.query().delete().where('categoryID', idRequested);
                return res.status(200).send('Success');
            }
            catch (error) {
                console.log(error);
                return res.status(400).send('Error deleting category');
            }
        }
        else {
            return res.status(400).send('Missing information');
        }
    }
    return res.status(401).send('Unauthorized');
});
router.delete('/criteria/:id', async (req, res) => {
    const idRequested = req.params.id;
    if (Permissions_1.can(req.user, Permissions_1.Action.DeleteCriteria)) {
        if (idRequested) {
            try {
                await Criteria_1.default.query().deleteById(idRequested);
                return res.status(200).send('Success');
            }
            catch (error) {
                console.log(error);
                return res.status(400).send('Error deleting criteria');
            }
        }
        else {
            return res.status(400).send('Missing information');
        }
    }
    return res.status(401).send('Unauthorized');
});
exports.default = router;
