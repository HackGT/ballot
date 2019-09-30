import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import users from './User';
import account from './Account';
import categories from './Category';
import projects from './Project';
import ballots from './Ballot';
import requesting from './Request';
import tableGroups from './TableGroup';
import socketMiddleware from './Socket';
import User, { UserState } from '../types/User';
import { CategoryState } from '../types/Category';
import { ProjectState, TableGroupState } from '../types/Project';
import { BallotState } from '../types/Ballot';

const reducer = combineReducers({
  account,
  ballots,
  categories,
  projects,
  requesting,
  tableGroups,
  users,
});

const composeEnhancers = typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

export default createStore(
  reducer,
  compose(
    applyMiddleware(
      thunk,
      socketMiddleware(),
    ),
    composeEnhancers(),
  ),
);

export interface AppState {
  account: User;
  ballots: BallotState;
  categories: CategoryState;
  projects: ProjectState;
  requesting: boolean;
  tableGroups: TableGroupState;
  users: UserState;
}
