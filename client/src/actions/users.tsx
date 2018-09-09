import { Dispatch } from 'redux';
import { UserState } from '../types/State';
import Action from '../types/Action';

export const REFRESH_USERS = 'REFRESH_USERS';
export const ADD_USER = 'ADD_USER';
export const EDIT_USER = 'EDIT_USER';
export const REMOVE_USER = 'REMOVE_USER';

export interface RefreshUsersAction extends Action {
    users: UserState[];
}

export interface AddUserAction extends Action {
    user: UserState;
}

export interface EditUserAction extends Action {
    user: UserState;
}

export interface RemoveUserAction extends Action {
    user: UserState;
}

export const refreshUsers: (users: UserState[]) => RefreshUsersAction = (users: UserState[]) => {
    return {
        type: REFRESH_USERS,
        users,
    };
};

export const addUser: (user: UserState) => AddUserAction = (user: UserState) => {
    return {
        type: ADD_USER,
        user,
    };
};

export const editUser: (user: UserState) => EditUserAction = (user: UserState) => {
    return {
        type: EDIT_USER,
        user,
    };
};

export const removeUser: (user: UserState) => RemoveUserAction = (user: UserState) => {
    return {
        type: REMOVE_USER,
        user,
    };
};
