import User, { IUser, UserRole } from "../model/user.model";

export enum Role {
    Pending = 'Pending',
    Judge = 'Judge',
    Admin = 'Admin',
    Owner = 'Owner',
}

export enum Action {
    Reset = 'Reset',

    EditUser = 'EditUser',
    DeleteUser = 'DeleteUser',
    ViewUsers = 'ViewUsers',

    ViewCategories = 'ViewCategories',
    AddCategory = 'AddCategory',
    DeleteCategory = 'DeleteCategory',
    UpdateCategory = 'UpdateCategory',

    ViewCriteria = 'ViewCriteria',
    AddCriteria = 'AddCriteria',
    DeleteCriteria = 'DeleteCriteria',
    UpdateCriteria = 'UpdateCriteria',

    BatchUploadProjects = 'BatchUploadProjects',
    AddProject = 'AddProject',
    DeleteProject = 'DeleteProject',
    UpdateProject = 'UpdateProject',
    ViewProjects = 'ViewProjects',

    ViewBallot = 'ViewBallot',
    ScoreBallot = 'ScoreBallot',

    StartProject = 'StartProject',
    SkipProject = 'SkipProject',

    ViewRanking = 'ViewRanking',
}

export function can(user: IUser, action: Action): boolean {
    if (user) {
        switch (action) {
            case Action.Reset:
                return user.role === UserRole.Owner;
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
                return user.role === UserRole.Owner
                    || user.role === UserRole.Admin;
            case Action.ViewProjects:
            case Action.ViewBallot:
            case Action.ScoreBallot:
            case Action.StartProject:
            case Action.SkipProject:
                return user.role === UserRole.Owner
                    || user.role === UserRole.Admin
                    || user.role === UserRole.Judge;
            case Action.ViewProjects:
                return true;
        }
    }

    return false;
}
