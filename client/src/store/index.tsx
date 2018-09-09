import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import auth from '../reducers/auth';
import ballotset from '../reducers/ballotset';
import projects from '../reducers/projects';

const reducer = combineReducers({
    auth,
    ballotset,
    projects,
});

export default createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).
        __REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
);