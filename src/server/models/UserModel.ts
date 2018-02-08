export interface IUserModel {
    userId?: string;
    name: string;
    email: string;
    userClass: UserClass;
    service: string;
    salt?: string;
    hash?: string;
}

export enum UserClass {
    'Pending' = 0, // Created account, must be approved by admin/owner
    'Judge'   = 1,
    'Admin'   = 2,
    'Owner'   = 3,   // First User, cannot be removed by another admin.
}
