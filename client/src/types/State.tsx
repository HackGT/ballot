export interface AuthState {
    role: string | null;
}

export interface BallotState {
    ballot_id: number;
    project_id: number;
    criteria_id: number;
    // user_id: number;
    judge_priority: number;
    ballot_status: any;
    score?: number;
    score_submitted_at?: any;
    criteria: {
        name: string;
        rubric: string;
        min_score?: number;
        max_score?: number;
        category_id: number;
        category: {
            name: string;
            is_primary: boolean;
        }
    };
}

export interface BallotSetState {
    ballots: BallotState[];
}

export interface ProjectState {
    project_id: number;
    devpost_id: number;
    name: string;
    table_number: number;
    expo_number: number;
}

export interface State {
    auth: AuthState;
    ballotset: BallotSetState;
    projects: ProjectState[];
}