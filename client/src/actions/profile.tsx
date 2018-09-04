import {
    UpdateClassActionType,
    UpdateClassRequestType
} from '../types/UpdateClass';
import { Dispatch } from 'redux';

export const UPDATE_CLASS = 'UPDATE_CLASS';

export const updateClass =
    (json: UpdateClassRequestType): UpdateClassActionType => {
        console.log(json);
        return {
            type: UPDATE_CLASS,
            email: json.email ? json.email : '',
            name: json.name ? json.name : '',
            role: json.class ? json.class : 'None',
        };
    };

export const fetchProfileClass = () => {
    console.log('fetch');
    return async (dispatch: Dispatch<any>) => {
        const authResult = await fetch('/auth/user_data', { credentials: 'same-origin' });
        const authJSON = await authResult.json();
        dispatch(updateClass({
            name: authJSON.name,
            email: authJSON.email,
            class: authJSON.user_class,
        }));
    };
};
