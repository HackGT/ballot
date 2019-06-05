import { combineReducers, createStore } from 'redux';
import users, { UserState } from './UserManagement';
import account from './UserAccount';
import categories, { CategoryState } from './Category';
import projects, { ProjectState } from './Project';
import User from '../types/User';

const reducer = combineReducers({
    account,
    users,
    categories,
    projects,
});

export default createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any)
        .__REDUX_DEVTOOLS_EXTENSION__(),
)

export interface AppState {
    account: User;
    users: UserState;
    categories: CategoryState;
    projects: ProjectState;
}
