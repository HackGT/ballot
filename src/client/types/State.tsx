export interface AuthState {
    role: string | null;
};

export interface State {
    auth: AuthState,
};