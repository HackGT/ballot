export default interface User {
    id?: number;
    name?: string;
    email?: string;
    role: UserRole;
    tags?: string[];
}

export enum UserRole {
    None = 0,
    Pending = 1,
    Judge = 2,
    Admin = 3,
    Owner = 4,
}

export function roleStringToEnum(role: string) {
    switch (role) {
        case 'Owner':
            return UserRole.Owner;
        case 'Admin':
            return UserRole.Admin;
        case 'Judge':
            return UserRole.Judge;
        case 'Pending':
            return UserRole.Pending;
        default:
            return UserRole.None;
    }
}

export function getRoleName(role: UserRole) {
    switch (role) {
        case UserRole.Owner:
            return 'Owner';
        case UserRole.Admin:
            return 'Admin';
        case UserRole.Judge:
            return 'Judge';
        case UserRole.Pending:
            return 'Pending';
        case UserRole.None:
            return 'None';
        default:
            return null;
    }
}