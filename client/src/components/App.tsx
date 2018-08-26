import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AdminPageContainer from '../containers/admin/AdminPageContainer';
import JudgeContainer from '../containers/judging/JudgeContainer';
import NoSessionContainer from '../util/RedirectNoSession';
import PendingContainer from '../containers/PendingContainer';

const App: React.SFC < {} > = (props): JSX.Element => {
    return (
        <div>
            <NoSessionContainer />
            <Route component={PendingContainer} />
            <Route component={JudgeContainer} />
            <Route component={AdminPageContainer} />
        </div>
    );
};

export default App;
