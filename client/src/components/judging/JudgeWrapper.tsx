import * as React from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import { Switch, Route, match, Redirect } from 'react-router';
import Judging from './Judging';
import StatusContainer from '../../containers/StatusContainer';
import { ExpoContainer } from '../../containers/expo/ExpoContainer';

interface JudgeWrapperProps {}

const JudgeWrapper: React.SFC<JudgeWrapperProps> = (props) => {
    return (
        <div style={{
            width: '100%',
            maxWidth: 960,
            margin: '0 auto',
        }}>
            <Navigation
                linkNames={['Home', 'Judging', 'Expo']}
                linkDests={['/', '/judging', '/expo']}
                hasSession={true} />
            <div style={{
                padding: 15,
            }}>
                <Switch>
                    <Route exact path='/judging' component={Judging} />
                    <Route exact path='/expo' component={ExpoContainer} />
                    <Route exact path='/' component={StatusContainer} />
                    <Route path='*' render={() => <Redirect to='/' />} />
                </Switch>
            </div>
        </div>
    );
};

export default JudgeWrapper;
