import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import AdminPanelUsers from '../../components/admin/AdminPanelUsers';

import { State, AuthState, UserState } from '../../types/State';
import { refreshUsers, addUser, editUser, removeUser } from '../../actions/users';

interface StateToProps {
    auth: AuthState;
    users: UserState[];
}

interface DispatchToProps {
    refreshUsers: (users: UserState[]) => void;
    addUser: (user: UserState) => void;
    editUser: (user: UserState) => void;
    removeUser: (user: UserState) => void;
}

const mapStateToProps = (state: State): StateToProps => {
    return {
        auth: state.auth,
        users: state.users,
    };
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        refreshUsers: (users: UserState[]) => {
            dispatch(refreshUsers(users));
        },
        addUser: (user: UserState) => {
            dispatch(addUser(user));
        },
        editUser: (user: UserState) => {
            dispatch(editUser(user));
        },
        removeUser: (user: UserState) => {
            dispatch(removeUser(user));
        },
    };
}

export const AdminPanelUsersContainer = connect<StateToProps, DispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(AdminPanelUsers);
