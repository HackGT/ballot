import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import User, { roleStringToEnum, EMPTY_USER } from '../../types/User';
import { AppState } from '../../state/Store';
import { addUser, deleteUser, updateUser, fillUsers, UserState } from '../../state/User';

import PageAdminUsersModal from './PageAdminUsersModal';
import PageAdminUserCard from './PageAdminUserCard';

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
    fillUsers: (users: UserState) => {
      dispatch(fillUsers(users));
    },
  };
};

interface PageAdminUsersProps {
  account: User;
  users: UserState;
  addUser: (user: User) => void;
  deleteUser: (userID: number) => void;
  updateUser: (user: User) => void;
  fillUsers: (users: UserState) => void;
}

type State = {
  newUser: User;
  modalOpen: boolean;
  modalUser: User;
  requesting: boolean;
};

type Action =
  | { type: 'request-start' }
  | { type: 'request-finish' }
  | { type: 'change-newUser', newUser: Partial<User> }
  | { type: 'modal-open', user: User }
  | { type: 'modal-close' };

const PageAdminUsersComponent: React.FC<PageAdminUsersProps> = (props) => {
  const initialState = {
    newUser: EMPTY_USER,
    modalOpen: false,
    modalUser: EMPTY_USER,
    requesting: false,
  };
  const [state, dispatch] = React.useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'request-start':
        return { ...state, requesting: true };
      case 'request-finish':
        return { ...state, requesting: false };
      case 'modal-open':
        return { ...state, modalOpen: true, modalUser: action.user };
      case 'modal-close':
        return { ...state, modalOpen: false };
      case 'change-newUser':
        return {
          ...state,
          newUser: {
            ...state.newUser,
            ...action.newUser,
          }
        }
      default:
        return state;
    }
  }, initialState, undefined);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    dispatch({ type: 'request-start' });
    const result = await Axios.get('/api/users/allUsers');
    if (result.status) {
      const payload: UserState = result.data;
      const toFill: UserState = {};
      for (const user of Object.values(payload)) {
        toFill[user.id] = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: roleStringToEnum(user.role),
          tags: user.tags,
        };
      };
      props.fillUsers(toFill);
      dispatch({ type: 'request-finish' });
    } else {
      // TODO error checking
    }
  };

  const getUserCards = () => {
    const openModal = (event: any, user: User) => {
      event.preventDefault();
      dispatch({ type: 'modal-open', user });
    };

    return Object.values(props.users).map((user: User) => {
      return (
        <PageAdminUserCard key={user.id} user={user} openModal={openModal} />
      )
    });
  };

  if (Object.keys(props.users).length > 0) {
    return (
      <div style={{ margin: '12px' }}>
        <h1 style={{ textAlign: 'center' }}>Users</h1>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: 1300,
          margin: '12px auto 0',
        }}>
          {getUserCards()}
          <PageAdminUsersModal
            modalOpen={state.modalOpen}
            closeModal={() => dispatch({ type: 'modal-close' })}
            user={state.modalUser} />
        </div>
      </div>
    );
  } else {
    if (state.requesting) {
      return <div>Fetching users.</div>;
      // TODO replace with spinner.
    } else {
      return <div>Error fetching users.</div>;
      // TODO add try again button.
    }
  }
};

const PageAdminUsers = connect(mapStateToProps, mapDispatchToProps)(PageAdminUsersComponent);

export default PageAdminUsers;
