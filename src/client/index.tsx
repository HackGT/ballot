import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import App from './components/App';
import Authorization from './components/Authorization';
import FetcherContainer from './containers/FetcherContainer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './global.scss';
import NoSession from './util/RedirectNoSession';
import store from './store';

const UserNone = Authorization(['None']);
const UserAuth = Authorization(['Pending', 'Judge', 'Admin', 'Owner']);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <FetcherContainer />
                <Route component={UserAuth(App)} />
                <Switch>
                    <Route path='/login' component={LoginPage} />
                    <Route path='/register' component={RegisterPage} />
                    <Route component={UserNone(NoSession)} />
                </Switch>
            </div>
        </Router>
    </Provider>,
    document.getElementById('app') as HTMLElement
);
