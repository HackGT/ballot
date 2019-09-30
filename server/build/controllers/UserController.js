"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../config/Database"));
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
class UserController {
    static async getAllUsers() {
        const connection = Database_1.default.getConnection();
        const allUsers = await connection.manager.find(User_1.User);
        return allUsers;
    }
    static async getAllUsersSafe() {
        const userRepository = typeorm_1.getRepository(User_1.User);
        const allUsersSafe = await userRepository.find({
            select: [
                'id',
                'email',
                'name',
                'role',
                'isJudging',
                'tags',
                'createdAt',
                'updatedAt',
            ],
        });
        const usersToReturn = {};
        for (const user of allUsersSafe) {
            usersToReturn[user.id] = {
                ...user,
            };
        }
        return usersToReturn;
    }
    static async updateUser(user) {
        const userRepository = typeorm_1.getRepository(User_1.User);
        return await userRepository.save(user);
    }
}
exports.default = UserController;
