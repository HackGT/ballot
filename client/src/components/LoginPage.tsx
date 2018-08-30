import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { H1 } from '@blueprintjs/core';
import LoginButtons from './login/LoginButtons';
import YesSessionContainer from '../util/RedirectYesSession';
import Register from './login/Register';
import Login from './login/Login';
import LoginContainer from '../containers/LoginContainer';

interface LoginProps {}

const LoginPage: React.SFC<LoginProps> = (props) => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <header style={{
                textAlign: 'center',
                padding: '20px 0',
            }}>
                <H1>HackGT: Ballot</H1>
            </header>
            <div
                style={{
                    maxWidth: 960,
                    width: '100%',
                    margin: '0 auto',
                    padding: '0 20px',
                }}
            >
                <div>
                    <Switch>
                        <Route path='/login' component={LoginContainer} />
                        <Route path='/register' component={Register} />
                    </Switch>
                </div>
            </div>
            <footer style={{ textAlign: 'center' }}>
                Made with &lt;3 by the HackGTeam
            </footer>
        </div>
    );
};

export default LoginPage;
