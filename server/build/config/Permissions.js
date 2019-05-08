"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    Action["AddCategory"] = "AddCategory";
    Action["DeleteCategory"] = "DeleteCategory";
    Action["UpdateCategory"] = "UpdateCategory";
    Action["ViewCriteria"] = "ViewCriteria";
    Action["AddCriteria"] = "AddCriteria";
    Action["DeleteCriteria"] = "DeleteCriteria";
    Action["UpdateCriteria"] = "UpdateCriteria";
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
                return user.role === Role.Owner;
            case Action.EditUser:
            case Action.DeleteUser:
            case Action.ViewUsers:
            case Action.ViewCategories:
            case Action.AddCategory:
            case Action.DeleteCategory:
            case Action.UpdateCategory:
            case Action.ViewCriteria:
            case Action.AddCriteria:
            case Action.DeleteCriteria:
            case Action.UpdateCriteria:
            case Action.BatchUploadProjects:
            case Action.AddProject:
            case Action.DeleteProject:
            case Action.UpdateProject:
                return user.role === Role.Owner || user.role === Role.Admin;
            case Action.ViewProjects:
            case Action.ViewBallot:
            case Action.ScoreBallot:
            case Action.StartProject:
            case Action.SkipProject:
                return user.role === Role.Owner || user.role === Role.Admin || user.role === Role.Judge;
            case Action.ViewProjects:
                return true;
        }
    }
    return false;
}
exports.can = can;
