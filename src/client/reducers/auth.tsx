import { UPDATE_CLASS } from '../actions/Fetcher';
import Action from '../types/Action';
import { AuthState } from '../types/State';
import { UpdateClassActionType } from '../types/UpdateClass';

const auth = (state: AuthState, actionAny: Action): AuthState => {
    if (state === undefined) {
        return { role: null };
    }

    switch (actionAny.type) {
        case UPDATE_CLASS:
            const action = actionAny as UpdateClassActionType;
            return { role: action.role };
        default:
            return state;
    }
};

export default auth;