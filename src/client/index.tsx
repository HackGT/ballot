import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './store/rootReducer';
import App from './components/App';
import Authorization from './components/Authorization';
import FetcherContainer from './containers/FetcherContainer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NoSession from './components/NoSession';
import './global.scss';

const UserNone = Authorization(['None']);
const UserAuth = Authorization(['Pending', 'Judge', 'Admin', 'Owner']);

const store = createStore(rootReducer);

ReactDOM.render(
    <Router>
    	<Provider store={store}>
            <div>
                <FetcherContainer />
                <Route exact path='/' component={UserAuth(App)} />
                <Switch>
                    <Route path='/login' component={LoginPage} />
                    <Route path='/register' component={RegisterPage} />
                    <Route path='/' component={UserNone(NoSession)} />
                </Switch>
            </div>
        </Provider>
    </Router>,
    document.getElementById('app') as HTMLElement
);
