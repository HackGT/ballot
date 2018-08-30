const schema = `
scalar Date

type Query {
    nextBallotSet(user_id: Int!, current_project_id: Int): [Ballot!]!
    getRanking: [CriteriaRanking!]!
}

type Mutation {
    scoreProject(user_id: Int!, scores: [ProjectScores!]!): [Ballot!]!
    skipProject(user_id: Int!): [Ballot!]!
}

type CriteriaRanking {
    criteria_name: String!
    criteria_id: String!
    category_id: String!
    category_name: String!
    ranking: [ScoreSummary!]!
}

type ScoreSummary {
    name: String!
    project_id: String!
    score: Float!
    judge_count: Int!
    devpost_id: String!
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
    Started
}`;

export interface ProjectScores {
    ballot_id: number;
    score: number;
}

export default schema;
