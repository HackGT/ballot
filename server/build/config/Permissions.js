"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../entity/User");
var Role;
(function (Role) {
    Role["Pending"] = "Pending";
    Role["Judge"] = "Judge";
    Role["Admin"] = "Admin";
    Role["Owner"] = "Owner";
})(Role = exports.Role || (exports.Role = {}));
var Action;
(function (Action) {
    Action["Reset"] = "Reset";
    Action["EditUser"] = "EditUser";
    Action["DeleteUser"] = "DeleteUser";
    Action["ViewUsers"] = "ViewUsers";
    Action["ViewCategories"] = "ViewCategories";
    Action["ViewCategoriesCriteria"] = "ViewCategoriesCriteria";
    Action["AddCategory"] = "AddCategory";
    Action["DeleteCategory"] = "DeleteCategory";
    Action["UpdateCategory"] = "UpdateCategory";
    Action["ManageTableGroups"] = "ManageTableGroups";
    Action["ViewTableGroups"] = "ViewTableGroups";
    Action["BatchUploadProjects"] = "BatchUploadProjects";
    Action["AddProject"] = "AddProject";
    Action["DeleteProject"] = "DeleteProject";
    Action["UpdateProject"] = "UpdateProject";
    Action["ViewProjects"] = "ViewProjects";
    Action["ViewBallot"] = "ViewBallot";
    Action["ScoreBallot"] = "ScoreBallot";
    Action["StartProject"] = "StartProject";
    Action["SkipProject"] = "SkipProject";
    Action["ViewRanking"] = "ViewRanking";
})(Action = exports.Action || (exports.Action = {}));
function can(user, action) {
    if (user) {
        switch (action) {
            case Action.Reset:
                return user.role === User_1.UserRole.Owner;
            case Action.EditUser:
            case Action.DeleteUser:
            case Action.ViewUsers:
            case Action.ViewCategoriesCriteria:
            case Action.AddCategory:
            case Action.DeleteCategory:
            case Action.UpdateCategory:
            case Action.ManageTableGroups:
            case Action.BatchUploadProjects:
            case Action.AddProject:
            case Action.DeleteProject:
            case Action.UpdateProject:
                return user.role === User_1.UserRole.Owner
                    || user.role === User_1.UserRole.Admin;
            case Action.ViewProjects:
            case Action.ViewBallot:
            case Action.ScoreBallot:
            case Action.StartProject:
            case Action.SkipProject:
                return user.role === User_1.UserRole.Owner
                    || user.role === User_1.UserRole.Admin
                    || user.role === User_1.UserRole.Judge;
            case Action.ViewProjects:
            case Action.ViewCategories:
            case Action.ViewTableGroups:
                return true;
        }
    }
    return false;
}
exports.can = can;
