import {
    UpdateClassActionType,
    UpdateClassRequestType
} from '../types/UpdateClass';
import { Dispatch } from 'react-redux';

export const UPDATE_CLASS = 'UPDATE_CLASS';

export const updateClass =
    (json: UpdateClassRequestType): UpdateClassActionType => {
        console.log(json);
        return {
            type: UPDATE_CLASS,
            role: json.a ? json.a : 'None',
        };
    };

export const fetchProfileClass = () => {
    console.log('fetch');
    return (dispatch: Dispatch<any>) => {
        fetch('/auth/user_data/class', { credentials: 'same-origin' })
            .then((result) => result.json())
            .then((profile) => dispatch(updateClass(profile)))
            .catch((err) => console.log(err));
    };
};
