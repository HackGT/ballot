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

export const EMPTY_USER: User = {
  id: -1,
  name: '',
  email: '',
  role: UserRole.Pending,
  tags: [],
}

export function clientUserToServerUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: getRoleEnum(user.role),
    tags: user.tags,
  };
}

export function serverDataToClientUser(data: any) {
  if (data.id && data.name && data.email && data.role && data.tags) {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: roleStringToEnum(data.role),
      tags: data.tags,
    };
  } else {
    throw new Error('Server returned an unexpected result.');
  }
}

export function roleStringToEnum(role: string) {
  switch (role) {
    case 'owner':
      return UserRole.Owner;
    case 'admin':
      return UserRole.Admin;
    case 'judge':
      return UserRole.Judge;
    case 'pending':
      return UserRole.Pending;
    default:
      return UserRole.None;
  }
}

export function getRoleString(role: UserRole) {
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

export function getRoleEnum(role: UserRole) {
  switch (role) {
    case UserRole.Owner:
      return 'owner';
    case UserRole.Admin:
      return 'admin';
    case UserRole.Judge:
      return 'judge';
    case UserRole.Pending:
      return 'pending';
    case UserRole.None:
      return 'none';
    default:
      return null;
  }
}
