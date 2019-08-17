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
}
