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
    CreateCategory = 'CreateCategory',
}
export type Target = UserModel | BallotModel | CategoryModel |
    ProjectModel | number;

export function can(this: UserModel, action: Action, target?: Target): boolean {
    switch (action) {
        case Action.PromoteUser:
        case Action.DeleteUser:
        case Action.CreateCategory:
        case Action.ViewUsers:
            return this.user_class === UserClass.Admin ||
                this.user_class === UserClass.Owner;

        case Action.EditUser:
        case Action.ChangePassword:
            return this.user_class === UserClass.Admin ||
                this.user_class === UserClass.Owner ||
                this.user_id === (target as number);
    }

    return false;
}
