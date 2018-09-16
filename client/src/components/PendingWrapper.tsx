import * as React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Callout } from '@blueprintjs/core';
import Navigation from './Navigation';
import { ExpoContainer } from '../containers/expo/ExpoContainer';
import PendingContent from './pending/PendingContent';

interface PendingWrapperProps {}

const PendingWrapper: React.SFC<PendingWrapperProps> = (props) => {
    return (
        <div style={{
            width: '100%',
            maxWidth: 960,
            margin: '0 auto',
        }}>
            <Navigation linkNames={['Home', 'Expo']} linkDests={['/', '/expo']} hasSession={true} />

            <div style={{
                padding: 15,
            }}>
                <Switch>
                    <Route exact path='/expo' component={ExpoContainer} />
                    <Route exact path='/' component={PendingContent} />
                    <Route path='*' render={() => <Redirect to='/' />} />
                </Switch>
            </div>
        </div>
    );
};

export default PendingWrapper;
