const schema = `
scalar Date

type Query {
    nextBallotSet(user_id: Int!): [Ballot!]!
}

type Mutation {
    scoreProject(user_id: Int!, scores: [ProjectScores!]!): [Ballot!]!
}

type Ballot {
    ballot_id: Int!
    project_id: Int!
    criteria_id: Int!
    user_id: Int!
    judge_priority: Int!
    ballot_status: BallotStatus!
    score: Int
    score_submitted_at: Date
}

input ProjectScores {
    ballot_id: Int!
    score: Int!
}

enum BallotStatus {
    Pending
    Assigned
    Submitted
    Reviewed
}`;

export interface ProjectScores {
    ballot_id: number;
    score: number;
}

export default schema;
