import Action from './Action';

export interface UpdateClassRequestType {
    email: string | null;
    name: string | null;
    class: string | null;
    user_id: number | null;
}

export interface UpdateClassActionType extends Action {
    email: string | null;
    name: string | null;
    role: string | null;
    user_id: number | null;
}
