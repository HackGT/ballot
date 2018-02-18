import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import Authorization from "./components/Auth";
import AppContainer from "./components/AppContainer";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NoSession from "./components/NoSession";
import './global.scss';

const UserNone = Authorization(['None']);
const UserAuth = Authorization(['Pending', 'Judge', 'Admin', 'Owner']);

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={UserAuth(AppContainer)} />
            <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/" component={UserNone(NoSession)} />
            </Switch>
        </div>
    </Router>,
    document.getElementById('app') as HTMLElement
);