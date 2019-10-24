import React from 'react';
import { connect } from 'react-redux';

import User, { EMPTY_USER, UserState } from '../../types/User';
import { AppState } from '../../state/Store';
import { fetchUsers } from '../../state/User';

import PageAdminUsersModal from './PageAdminUsersModal';
import PageAdminUserCard from './PageAdminUserCard';
import { requestFinish, requestStart } from '../../state/Request';
import { fetchCompanies } from '../../state/Company';

const mapStateToProps = (state: AppState) => {
  return {
    account: state.account,
    requesting: state.requesting,
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchCompanies: () => {
      dispatch(fetchCompanies());
    },
    fetchUsers: () => {
      dispatch(fetchUsers());
    },
    requestFinish: () => {
      dispatch(requestFinish());
    },
    requestStart: () => {
      dispatch(requestStart());
    },
  };
};

interface PageAdminUsersProps {
  account: User;
  requesting: boolean;
  users: UserState;
  fetchCompanies: () => void;
  requestFinish: () => void;
  requestStart: () => void;
  fetchUsers: () => void;
}

type State = {
  newUser: User;
  modalOpen: boolean;
  modalUser: User;
};

type Action =
  | { type: 'change-newUser', newUser: Partial<User> }
  | { type: 'modal-open', user: User }
  | { type: 'modal-close' };

const PageAdminUsersComponent: React.FC<PageAdminUsersProps> = (props) => {
  const initialState = {
    newUser: EMPTY_USER,
    modalOpen: false,
    modalUser: EMPTY_USER,
  };
  const [state, dispatch] = React.useReducer((state: State, action: Action) => {
    switch (action.type) {
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
    props.fetchCompanies();
  }, []);

  const fetchUsers = async () => {
    props.requestStart();
    props.fetchUsers();
    props.requestFinish();
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
    if (props.requesting) {
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
