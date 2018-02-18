import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Authorization from "./components/Auth";
import NoSession from "./components/NoSession";
import Hello from "./containers/Hello";
import Login from "./components/Login";
import Register from "./components/Register";
import AppContainer from "./components/AppContainer";
import Ranking from "./components/admin/Ranking";
import Events from "./components/admin/Events";
import Projects from "./components/admin/Projects";
import Users from "./components/admin/Users";
import ProjectList from "./components/judge/ProjectList";
import JudgingList from "./components/judge/JudgingList";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import { number } from './reducers/index';
import { StoreState } from './types/index';

const UserNone = Authorization(['None']);
const UserAuth = Authorization(['Pending', 'Judge', 'Admin', 'Owner']);

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={UserAuth(AppContainer)} />
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/" component={UserNone(NoSession)} />
            </Switch>
        </div>
    </Router>,
    document.getElementById('app') as HTMLElement
);