import User, { UserRole } from '../types/User';

// Action Types
export const UPDATE_USER = 'ACCOUNT_UPDATE_USER';
export const LOGIN_USER = 'ACCOUNT_LOGIN_USER';
export const LOGOUT_USER = 'ACCOUNT_LOGOUT_USER';

const noAccountUser: User = {
    role: UserRole.None,
};

// Action Creators
export function updateUser(updatedUser: User) {
    return { type: UPDATE_USER, user: updatedUser };
}

export function loginUser(userToLogin: User) {
    return { type: LOGIN_USER, user: userToLogin };
}

export function logoutUser() {
    return { type: LOGOUT_USER, user: noAccountUser};
}

// Reducer
export default function account(state: User = noAccountUser, action: any) {
    switch (action.type) {
        case UPDATE_USER:
        case LOGIN_USER:
        case LOGOUT_USER:
            return action.user;
        default:
            return state;
    }
}
