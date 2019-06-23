"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
var UserRole;
(function (UserRole) {
    UserRole["Owner"] = "owner";
    UserRole["Admin"] = "admin";
    UserRole["Judge"] = "judge";
    UserRole["Pending"] = "pending";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
exports.UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        required: true,
        enum: ['owner', 'admin', 'judge', 'pending'],
    },
    tags: { type: [String], required: false },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
});
const User = mongoose.model('User', exports.UserSchema);
exports.default = User;
