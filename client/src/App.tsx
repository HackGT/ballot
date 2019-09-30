import Axios from 'axios';
import React from 'react';
import { AppState } from './state/Store';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from './state/Account';

import Navigation from './components/Navigation';
import PageLogin from './components/account/PageLogin';
import PageLogout from './components/account/PageLogout';
import PageProfile from './components/account/PageProfile';
import PageProjects from './components/expo/PageProjects';
import PageJudging from './components/judge/PageJudging';
import PageAdmin from './components/admin/PageAdmin';
import PageRegister from './components/account/PageRegister';
import PageHome from './components/PageHome';
import User, { roleStringToEnum, UserRole } from './types/User';
import Footer from './components/Footer';
import { Spinner } from 'react-bootstrap';

interface AppProps {
  account: User;
  loginUser: (user: User) => void;
}

const AppComponent: React.FC<AppProps> = (props) => {
  const AuthRoute = ({component, roleNeeded, curRole, ...rest}: any) => {
    const routeComponent = (props: any) => (
        curRole >= roleNeeded
          ? React.createElement(component, props)
          : <Redirect to={{ pathname: '/login' }} />
    );

    return <Route {...rest} render={routeComponent} />;
  };

  const [loginFetched, changeLoginFetched] = React.useState(false);

  React.useEffect(() => {
    const checkUserData = async () => {
      const result = await Axios.get('/auth/user_data');

      props.loginUser({
        ...result.data,
        role: roleStringToEnum(result.data.role),
      });

      changeLoginFetched(true);
    };

    checkUserData();
  }, [props.loginUser]);

  if (!loginFetched) {
    return <Spinner animation='grow' />
  }

  return (
    <>
      <Router>
        <Navigation account={props.account} />
        <div style={{
          padding: 20,
        }}>
          <Switch>
            <Route path='/login' component={PageLogin} />
            <Route path='/logout' component={PageLogout} />
            <Route path='/register' component={PageRegister} />
            <AuthRoute path='/profile' component={PageProfile} roleNeeded={UserRole.Pending} curRole={props.account.role} />
            <AuthRoute path='/projects' component={PageProjects} roleNeeded={UserRole.Pending} curRole={props.account.role} />
            <AuthRoute path='/judging' component={PageJudging} roleNeeded={UserRole.Judge} curRole={props.account.role} />
            <AuthRoute path='/admin' component={PageAdmin} roleNeeded={UserRole.Admin} curRole={props.account.role} />
            <Route path='/' exact component={PageHome} />
            <Redirect to='/' />
          </Switch>
        </div>
      </Router>
      <Footer />
    </>
  );
};

// Redux
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

// Container
const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
