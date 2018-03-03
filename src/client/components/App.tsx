import * as React from 'react';
import { BrowserRouter as Router,Route } from 'react-router-dom';
import PendingContainer from '../containers/PendingContainer';
import AdminPageContainer from '../containers/admin/AdminPageContainer';
import JudgeContainer from '../containers/judging/JudgeContainer';

const App: React.SFC < {} > = (props): JSX.Element => {
    return (
        <Router>
            <div>
                <Route component={PendingContainer} />
                <Route component={JudgeContainer} />
                <Route component={AdminPageContainer} />
            </div>
        </Router>
    );
};


export default App;
