import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppContainer from './containers/AppContainer';
import FetcherContainer from './containers/FetcherContainer';
import LoginPage from './components/LoginPage';
import store from './store';

import './index.css';
import Logout from './components/login/Logout';
import { LogoutContainer } from './containers/LoginContainer';

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <div style={{ width: '100%', minWidth: 320 }} >
                <FetcherContainer />
                <Switch>
                    <Route path='/logout' component={LogoutContainer} />
                    <Route path='/' component={AppContainer} />
                </Switch>
            </div>
        </Provider>
    </Router>,
    document.getElementById('app') as HTMLElement
);
