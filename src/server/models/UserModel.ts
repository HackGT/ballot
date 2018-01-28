export interface IUserModel {
    name: string,
    email: string,
    userClass: UserClass
}

export enum UserClass {
    'Pending', // Created account, must be approved by admin/owner
    'Judge',
    'Admin',
    'Owner'   // First User, cannot be removed by another admin.
}