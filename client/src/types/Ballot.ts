export enum BallotStatus {
    Pending = 'pending',
    Assigned = 'assigned',
    Submitted = 'submitted',
    Missing = 'missing',
    Busy = 'busy',
    Skipped = 'skipped',
    Started = 'started',
}

export default interface Ballot {
    id?: number;
    status: BallotStatus;
    projectID: number;
    criteriaID: number;
    userID: number;
    score: number;
    createdAt: number;
    updatedAt: number;
    pending?: boolean;
}

export interface JudgeProjectBallotsMapping {
    [judgeID: number]: {
      [projectID: number]: Ballot[];
    };
}

export interface JudgeQueues {
    [userID: number]: {
        queuedProject: QueuedProject;
        activeProjectID: number;
        otherProjectIDs: number[];
    }
}

export interface QueuedProject {
    id: number;
    pending: boolean;
}

export interface BallotState {
    [ballotID: number]: Ballot;
    dJudgeQueues: JudgeQueues;
    dJudgeProjectBallotsMap: JudgeProjectBallotsMapping;
}
