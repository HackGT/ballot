import * as React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Pending from "./Pending";
import Admin from "./Admin";
import Judge from "./Judge";
import Authorization from "./Auth";

const UserPending = Authorization(['Pending']);
const UserJudge = Authorization(['Judge']);
const UserAdmin = Authorization(['Admin', 'Owner']);
const UserOwner = Authorization(['Owner']);

class AppContainer extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={UserPending(Pending)} />
                    <Route exact path="/" component={UserJudge(Judge)} />
                    <Route exact path="/" component={UserAdmin(Admin)} />
                </div>
            </Router>
        )
    }
}

export default AppContainer