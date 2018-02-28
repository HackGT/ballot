import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Authorization from './Auth';
import AdminPage from './admin/AdminPage';
import Pending from './Pending';
import Judge from './Judge';

const UserPending = Authorization(['Pending']);
const UserJudge = Authorization(['Judge']);
const UserAdmin = Authorization(['Admin', 'Owner']);
const UserOwner = Authorization(['Owner']);

interface AppContainerProps {}

const AppContainer: React.SFC<AppContainerProps> = (props) => {
    return (
        <Router>
            <div>
                <Route component={UserPending(Pending)} />
                <Route component={UserJudge(Judge)} />
                <Route component={UserAdmin(AdminPage)} />
            </div>
        </Router>
    );
};

export default AppContainer;
