"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ballot_1 = __importDefault(require("../routes/ballot"));
const category_1 = __importDefault(require("../routes/category"));
const project_1 = __importDefault(require("../routes/project"));
const tablegroup_1 = __importDefault(require("../routes/tablegroup"));
const user_1 = __importDefault(require("../routes/user"));
const router = express_1.Router();
router.use('/ballots', ballot_1.default);
router.use('/categories', category_1.default);
router.use('/projects', project_1.default);
router.use('/tableGroups', tablegroup_1.default);
router.use('/users', user_1.default);
exports.default = router;
