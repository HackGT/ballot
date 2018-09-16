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
    const newState = state;
    switch (actionAny.type) {
        case REFRESH_USERS:
            const actionUpdateUsers = actionAny as RefreshUsersAction;
            return actionUpdateUsers.users;
        case ADD_USER:
            const actionAddUser = actionAny as AddUserAction;
            newState.push(actionAddUser.user);
            return newState;
        case EDIT_USER:
            const actionEditUser = actionAny as EditUserAction;
            const betterState = newState.map((user: UserState) => {
                if (actionEditUser.user.user_id === user.user_id) {
                    user = actionEditUser.user;
                    return user;
                }

                return user;
            });
            return betterState;
        case REMOVE_USER:
            const actionRemoveUser = actionAny as RemoveUserAction;
            const removeUserState = newState.filter((user: UserState) => {
                if (actionEditUser.user.user_id === user.user_id) {
                    return false;
                }

                return true;
            });

            return removeUserState;
        default:
            return newState;
    }
};

export default users;
