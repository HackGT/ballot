export interface AuthState {
    email: string | null;
    name: string | null;
    role: string | null;
    user_id: number | null;
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
}

export interface CategoryState {
    category_id: number;
    name: string;
    is_primary: boolean;
    criteria: CriteriaState[];
}

export interface CriteriaState {
    criteria_id: number;
    name: string;
    rubric: string;
    min_score: number;
    max_score: number;
    category_id: number;
}

export interface ProjectState {
    project_id: number;
    devpost_id: string;
    name: string;
    table_number: string;
    expo_number: number;
    sponsor_prizes: string;
    categories?: CategoryState[];
}

export interface UserState {
    user_id: number;
    name: string;
    email: string;
    user_class: string;
}

export interface State {
    auth: AuthState;
    ballots: BallotState[];
    categories: CategoryState[];
    projects: ProjectState[];
}
