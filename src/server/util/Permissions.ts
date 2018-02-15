import { IUserModel } from '../models/UserModel';

export class Permissions {
    // TODO create actions enum, check user
    public static canDo(user: IUserModel, action: any): boolean {
        return true;
    }
}
