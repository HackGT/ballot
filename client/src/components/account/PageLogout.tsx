import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import User from '../../types/User';
import { logoutUser } from '../../state/Account';

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    logoutUser: () => {
      dispatch(logoutUser());
    },
  };
};

interface LogoutProps {
  account: User;
  logoutUser: () => void;
}

const PageLogoutComponent: React.FC<LogoutProps> = (props) => {
  const [success, changeSuccess] = React.useState(false);
  React.useEffect(() => {
    const logout = async () => {
      await Promise.all([Axios.get('/auth/logout'), sleep(500)])
      props.logoutUser();
      changeSuccess(true);
    };
    logout();
  }, [success]);

  return success
    ? <Redirect to='/' />
    : <Spinner animation='grow' />
};

const PageLogout = connect(null, mapDispatchToProps)(PageLogoutComponent);

export default PageLogout;
