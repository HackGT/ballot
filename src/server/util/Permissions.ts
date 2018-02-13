import { IUserModel } from '../models/UserModel';

export class Permissions {
    public static canDo(user: IUserModel, action: any): boolean {
        return false;
    }
}
