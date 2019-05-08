import { connect } from 'react-redux';
import { AppState } from '../../state/Store';
import PageAdminUsers from './PageAdminUsers';
import { fillUsers, addUser, deleteUser, updateUser } from '../../state/UserManagement';
import User from '../../types/User';

const mapStateToProps = (state: AppState) => {
    return {
        account: state.account,
        users: state.users,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addUser: (user: User) => {
            dispatch(addUser(user));
        },
        deleteUser: (userID: number) => {
            dispatch(deleteUser(userID));
        },
        updateUser: (user: User) => {
            dispatch(updateUser(user));
        },
        fillUsers: (users: User[]) => {
            dispatch(fillUsers(users));
        },
    };
}

const PageAdminUsersContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PageAdminUsers);

export default PageAdminUsersContainer;
