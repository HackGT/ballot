import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AdminWrapperContainer from '../containers/admin/AdminWrapperContainer';
import JudgeWrapperContainer from '../containers/judging/JudgeWrapperContainer';
import NoSessionContainer from '../util/RedirectNoSession';
import PendingWrapperContainer from '../containers/PendingWrapperContainer';
import Footer from './Footer';
import GeneralWrapperContainer from '../containers/GeneralWrapperContainer';
import YesSessionContainer from '../util/RedirectYesSession';

const App: React.SFC <{}> = (props): JSX.Element => {
    return (
        <div>
            <Route path='/login' component={YesSessionContainer} />
            <Route component={GeneralWrapperContainer} />
            <Route component={PendingWrapperContainer} />
            <Route component={JudgeWrapperContainer} />
            <Route component={AdminWrapperContainer} />
            <Footer />
        </div>
    );
};

export default App;
