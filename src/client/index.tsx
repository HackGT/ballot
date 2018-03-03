import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppContainer from './containers/AppContainer';
import FetcherContainer from './containers/FetcherContainer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './global.scss';
import NoSessionContainer from './util/RedirectNoSession';
import store from './store';

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <div>
                <FetcherContainer />
                <Route exact path='/' component={AppContainer} />
                <Switch>
                    <Route path='/login' component={LoginPage} />
                    <Route path='/register' component={RegisterPage} />
                    <Route path='/' component={NoSessionContainer} />
                </Switch>
            </div>
        </Provider>
    </Router>,
    document.getElementById('app') as HTMLElement
);
