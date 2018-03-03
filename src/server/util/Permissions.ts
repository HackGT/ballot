import { UserModel } from '../models/UserModel';

export class Permissions {
    // TODO create actions enum, check user
    public static canDo(user: UserModel, action: any): boolean {
        return true;
    }
}
