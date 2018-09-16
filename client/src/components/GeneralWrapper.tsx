import * as React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Callout } from '@blueprintjs/core';
import Navigation from './Navigation';
import { ExpoContainer } from '../containers/expo/ExpoContainer';
import PendingContent from './pending/PendingContent';
import LoginContainer from '../containers/LoginContainer';
import Register from './login/Register';
import NoSessionContainer from '../util/RedirectNoSession';

interface GeneralWrapperProps {}

const GeneralWrapper: React.SFC<GeneralWrapperProps> = (props) => {
    return (
        <div style={{
            width: '100%',
            maxWidth: 960,
            margin: '0 auto',
        }}>
            <Navigation linkNames={['Expo', 'Login']} linkDests={['/', '/login']} hasSession={false} />

            <div style={{
                padding: 15,
            }}>
                <Switch>
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={LoginContainer} />
                    <Route exact path='/' component={ExpoContainer} />
                    <Route path='*' render={() => <Redirect to='/' />} />
                </Switch>
            </div>
        </div>
    );
};

export default GeneralWrapper;
