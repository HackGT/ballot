export interface AuthState {
    role: string | null;
}

export interface BallotState {
    ballot_id: number;
    project_id: number;
    criteria_id: number;
    user_id: number;
    judge_priority: number;
    ballot_status: any;
    score?: number;
    score_submitted_at?: any;
    criteria: {
        name: string;
        rubric: string;
        min_score?: number;
        max_score?: number;
        catagory_id: number;
        catagory: {
            name: string;
            is_primary: boolean;
        }
    };
}

export interface BallotSetState {
    ballots: BallotState[];
}

export interface State {
    auth: AuthState;
    ballotset: BallotSetState;
}
