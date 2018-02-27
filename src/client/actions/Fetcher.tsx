import { UpdateClassActionType, UpdateClassRequestType } from '../types/UpdateClass';

export const UPDATE_CLASS = 'UPDATE_CLASS';

export const updateClass = (json: UpdateClassRequestType) : UpdateClassActionType => {
    return {
        type: UPDATE_CLASS,
        role: json.a,
    };
};