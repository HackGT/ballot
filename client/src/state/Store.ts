import { combineReducers, createStore } from 'redux';

import users, { UserState } from './User';
import account from './Account';
import categories from './Category';
import projects from './Project';
import tableGroups from './TableGroup';
import User from '../types/User';
import { CategoryState } from '../types/Category';
import { ProjectState, TableGroupState } from '../types/Project';

const reducer = combineReducers({
    account,
    categories,
    projects,
    tableGroups,
    users,
});

export default createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any)
        .__REDUX_DEVTOOLS_EXTENSION__(),
);

export interface AppState {
    account: User;
    categories: CategoryState;
    projects: ProjectState;
    tableGroups: TableGroupState;
    users: UserState;
}
