import Action from './Action';

export interface UpdateClassRequestType {
    a: string | null;
};

export interface UpdateClassActionType extends Action {
    role: string | null;
};