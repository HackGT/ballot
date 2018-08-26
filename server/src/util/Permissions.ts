import { UserModel, UserClass } from '../models/UserModel';
import { BallotModel } from '../models/BallotModel';
import { CategoryModel } from '../models/CategoryModel';
import { ProjectModel } from '../models/ProjectModel';

export enum Action {
    PromoteUser = 'PromoteUser',
    DeleteUser = 'DeleteUser',
    EditUser = 'EditUser',
    ViewUsers = 'ViewUsers',
    ChangePassword = 'ChangePassword',

    ViewCategories = 'ViewCategories',
    CreateCategory = 'CreateCategory',
    DeleteCategory = 'DeleteCategory',
    UpdateCategory = 'UpdateCategory',

    ViewBallot = 'ViewBallot',
    ScoreBallot = 'ScoreBallot',
    ViewRanking = 'ViewRanking',
}
export type Target = UserModel | BallotModel | CategoryModel |
    ProjectModel | number;

export function can(this: UserModel, action: Action, target?: Target): boolean {
    switch (action) {
        case Action.PromoteUser:
        case Action.DeleteUser:
        case Action.CreateCategory:
        case Action.ViewUsers:
        case Action.CreateCategory:
        case Action.DeleteCategory:
        case Action.UpdateCategory:
        case Action.ViewRanking:
            return this.user_class === UserClass.Admin ||
                this.user_class === UserClass.Owner;

        case Action.EditUser:
        case Action.ChangePassword:
        case Action.ScoreBallot:
        case Action.ViewBallot:
            return this.user_class === UserClass.Admin ||
                this.user_class === UserClass.Owner ||
                this.user_id === (target as number);

        case Action.ViewCategories:
            return this.user_class === UserClass.Admin ||
                this.user_class === UserClass.Owner ||
                this.user_class === UserClass.Judge;
    }

    return false;
}
