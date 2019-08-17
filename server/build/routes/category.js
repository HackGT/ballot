"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Permissions_1 = require("../config/Permissions");
const CategoryController_1 = __importDefault(require("../controllers/CategoryController"));
const router = express_1.Router();
router.get('/allCategories', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewCategories)) {
        return res.status(200).json(await CategoryController_1.default.getAllCategories());
    }
    return res.status(401).send('Not enough permissions to view categories.');
});
router.get('/allCategoriesCriteria', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.ViewCategoriesCriteria)) {
        return res.status(200).json(await CategoryController_1.default.getAllCategoriesWithCriteria());
    }
    return res.status(401).send('Not enough permissions to view categories.');
});
router.post('/update', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.UpdateCategory)) {
        return res.status(200).json(await CategoryController_1.default.updateCategory(req.body.categories));
    }
    return res.status(401).send('Not enough permissions to edit or create categories.');
});
router.post('/delete', async (req, res) => {
    console.log(req.body);
    if (Permissions_1.can(req.user, Permissions_1.Action.DeleteCategory)) {
        return res.status(200).json(await CategoryController_1.default.deleteCategory(req.body.categoryID));
    }
    return res.status(401).send('Not enough permissions to delete categories.');
});
router.delete('/deleteGenerated', async (req, res) => {
    if (Permissions_1.can(req.user, Permissions_1.Action.DeleteCategory)) {
        return res.status(200).json(await CategoryController_1.default.deleteGeneratedCategories());
    }
    return res.status(401).send('Not enough permissions to delete categories.');
});
exports.default = router;
