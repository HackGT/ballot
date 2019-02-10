const schema = `
scalar Date

type Query {
    nextBallotSet(user_id: Int!): NextBallot
    getRanking: [CriteriaRanking!]!
    getAllBallots: [Ballot!]!
}

type Mutation {
    startProject(user_id: Int!, project_id: Int!): Boolean!
    scoreProject(user_id: Int!, project_id: Int!, scores: [ProjectScores!]!): Boolean!
    skipProject(user_id: Int!, project_id: Int!): Boolean!
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

type Project {
    project_id: Int,
    devpost_id: String,
    name: String,
    table_number: String,
    expo_number: Int,
    sponsor_prizes: String,
    categories: [Category!]!
}

type Category

type NextBallot {
    project: Project!,
    ballots: [Ballot!]!,
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
    Skipped
}`;

export interface ProjectScores {
    ballot_id: number;
    score: number;
}

export default schema;
