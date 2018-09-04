import { UPDATE_CLASS } from '../actions/profile';
import Action from '../types/Action';
import { AuthState } from '../types/State';
import { UpdateClassActionType } from '../types/UpdateClass';

const initState: AuthState = {
    email: null,
    name: null,
    role: null,
};

const auth = (state: AuthState = initState, actionAny: Action): AuthState => {
    switch (actionAny.type) {
        case UPDATE_CLASS:
            const action = actionAny as UpdateClassActionType;
            return {
                email: action.email,
                name: action.name,
                role: action.role
            };
        default:
            return state;
    }
};

export default auth;
