"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    static error(message) {
        console.error(chalk_1.default.redBright('[Error]'), message);
    }
    static info(message) {
        console.info(chalk_1.default.blueBright('[Info]'), message);
    }
    static success(message) {
        console.info(chalk_1.default.green('[Info]'), message);
    }
}
exports.default = Logger;
