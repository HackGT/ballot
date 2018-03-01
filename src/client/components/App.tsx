import * as React from 'react';
import { BrowserRouter as Router,Route } from 'react-router-dom';
import Pending from './Pending';
import AdminPage from './admin/AdminPage';
import Judge from './judging/Judge';
import Authorization from './Authorization';

const UserPending = Authorization(['Pending']);
const UserJudge = Authorization(['Judge']);
const UserAdmin = Authorization(['Admin', 'Owner']);
const UserOwner = Authorization(['Owner']);

// const App: React.SFC < {} > = (props): JSX.Element => (
class App extends React.Component<{}, {}> {
    render() {
        return (
            <Router>
                <div>
                    <Route component={UserPending(Pending)} />
                    <Route component={UserJudge(Judge)} />
                    <Route component={UserAdmin(AdminPage)} />
                </div>
            </Router>
        );
    }
}


export default App;
