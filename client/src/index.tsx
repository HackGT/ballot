import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppContainer from './containers/AppContainer';
import FetcherContainer from './containers/FetcherContainer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './global.css';
import store from './store';

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <div>
                <FetcherContainer />
                <Switch>
                    <Route path='/login' component={LoginPage} />
                    <Route path='/register' component={RegisterPage} />
                    <Route path='/' component={AppContainer} />
                </Switch>
            </div>
        </Provider>
    </Router>,
    document.getElementById('app') as HTMLElement
);