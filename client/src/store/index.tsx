import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import auth from '../reducers/auth';
import ballots from '../reducers/ballotset';
import categories from '../reducers/categories';
import projects from '../reducers/projects';
import users from '../reducers/users';

const reducer = combineReducers({
    auth,
    ballots,
    categories,
    projects,
    users,
});

export default createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).
        __REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
);
