import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import User from '../../types/User';
import { AppState } from '../../state/Store';
import { loginUser } from '../../state/Account';

import AdminNavigation from './AdminNavigation';
import PageAdminUsers from './PageAdminUsers';
import PageAdminProjects from './PageAdminProjects';
import PageAdminCategories from './PageAdminCategories';
import PageAdminDashboard from "./PageAdminDashboard";

export const adminRoute = '/admin';

const mapStateToProps = (state: AppState) => {
  return {
    account: state.account,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loginUser: (user: User) => {
      dispatch(loginUser(user));
    },
  };
};

interface PageAdminProps {
  account: User;
  loginUser: (user: User) => void;
}

type State = {
  requesting: boolean;
}

type Action =
  | { type: 'request-start'}
  | { type: 'request-finish'};

const PageAdminComponent: React.FC<PageAdminProps> = (props) => {
  const [state, dispatch] = React.useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'request-start':
        return { ...state, requesting: true };
      case 'request-finish':
        return { ...state, requesting: false };
      default:
        return state;
    }
  }, {
    requesting: false,
  }, undefined);

  return (
    <div>
      <AdminNavigation />
      <Switch>
        <Route path={`${adminRoute}/users`} component={PageAdminUsers} />
        <Route path={`${adminRoute}/categories`} component={PageAdminCategories} />
        <Route path={`${adminRoute}/dashboard`} component={PageAdminDashboard} />
        <Route exact path={`${adminRoute}`} component={PageAdminProjects} />
        <Redirect to={`${adminRoute}`} />
      </Switch>
    </div>
  );
};

const PageAdmin = connect(mapStateToProps, mapDispatchToProps)(PageAdminComponent);

export default PageAdmin;
