import {
    REFRESH_USERS,
    ADD_USER,
    EDIT_USER,
    REMOVE_USER,
    RefreshUsersAction,
    AddUserAction,
    EditUserAction,
    RemoveUserAction,
} from '../actions/users';

import Action from '../types/Action';
import { UserState } from '../types/State';

const users = (
    state: UserState[] = [],
    actionAny: Action
): UserState[] => {
    switch (actionAny.type) {
        case REFRESH_USERS:
            const actionUpdateUsers = actionAny as RefreshUsersAction;
            return actionUpdateUsers.users;
        default:
            return state;
    }
};

export default users;
