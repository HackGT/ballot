import * as React from 'react';
import Header from '../Header';
import Navigation from '../Navigation';
import { Switch, Route } from 'react-router';
import Judging from './Judging';
import ExpoPage from '../expo/ExpoPage';
import Status from '../Status';
// import './Judge.scss';

interface JudgeProps {}

const Judge: React.SFC<JudgeProps> = (props) => {
    return (
        <div>
            <Header />
            <Navigation
                linkNames={['Home', 'Judging', 'Expo']}
                linkDests={['/', '/judging', '/expo']} />
            <Switch>
                <Route exact path='/judging' component={Judging} />
                <Route exact path='/expo' component={ExpoPage} />
                <Route exact path='/' component={Status} />
            </Switch>
        </div>
    );
};

export default Judge;
