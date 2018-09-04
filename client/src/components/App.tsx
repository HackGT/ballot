import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AdminWrapperContainer from '../containers/admin/AdminWrapperContainer';
import JudgeContainer from '../containers/judging/JudgeContainer';
import NoSessionContainer from '../util/RedirectNoSession';
import PendingContainer from '../containers/PendingContainer';
import Footer from './Footer';
import GeneralContainer from '../containers/GeneralContainer';
import YesSessionContainer from '../util/RedirectYesSession';

const App: React.SFC < {} > = (props): JSX.Element => {
    return (
        <div>
            {/* <NoSessionContainer /> */}
            <Route path='/login' component={YesSessionContainer} />
            <Route component={GeneralContainer} />
            <Route component={PendingContainer} />
            <Route component={JudgeContainer} />
            <Route component={AdminWrapperContainer} />
            <Footer />
        </div>
    );
};

export default App;
