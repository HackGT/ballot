import * as React from 'react';
import { CriteriaRanking, ViewType } from '../../util/ranking';
import { H2, H3, Button } from '@blueprintjs/core';
import { ProjectState, BallotState, CategoryState } from '../../types/State';
// import './Ranking.css';

interface ProjectRanking {
    project: ProjectState;
    ballots: BallotState[];
}

interface AdminPanelRankingProps {}

interface AdminPanelRankingState {
    categoryRanking: { [categoryID: number]: {
        category: CategoryState;
        criteria: number[],
        projectBallots: { [projectID: number]: {
            ballots: BallotState[];
            individualScores: number[];
            score: number;
        }},
    }};
    projects: { [projectID: number]: ProjectState };
}

class AdminPanelRanking extends React.Component<AdminPanelRankingProps, AdminPanelRankingState> {
    constructor(props: any) {
        super(props);
        this.state = {
            categoryRanking: {},
            projects: {},
        };

        this.fetchRankings = this.fetchRankings.bind(this);
    }

    public async componentDidMount() {
        await this.fetchRankings();
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div>
                <h1>Ranking
                    <span style={{
                        float: 'right',
                    }}>
                        <Button name='refresh' icon='refresh' large={true} intent='primary' minimal={true} onClick={this.fetchRankings} />
                    </span>
                </h1>
                {Object.keys(this.state.categoryRanking).map((categoryID) => {
                    const categorySection = this.state.categoryRanking[+categoryID];
                    return (
                        <div key={categoryID}>
                            <h2>{categorySection.category.name}</h2>
                            {Object.keys(categorySection.projectBallots).sort((a, b) => {
                                return categorySection.projectBallots[+b].score - categorySection.projectBallots[+a].score;
                            }).map((projectID) => {
                                return (
                                    <div key={projectID}>
                                        <h3>{this.state.projects[+projectID].name}</h3>
                                        <p>Expo: {this.state.projects[+projectID].expo_number} Table: {this.state.projects[+projectID].table_number} <br />
                                        Overall Score: {Math.round(categorySection.projectBallots[+projectID].score * 100) / 100}</p>
                                        <p>{categorySection.projectBallots[+projectID].individualScores.length} Individual Scores: {categorySection.projectBallots[+projectID].individualScores.toString()}</p>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        );
    }

    private async fetchRankings() {
        const result = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                    getAllBallots {
                        ballot_id
                        project_id
                        criteria_id
                        user_id
                        ballot_status
                        score
                    }
                    project {
                        project_id
                        devpost_id
                        name
                        table_number
                        expo_number
                        sponsor_prizes
                        categories {
                            category_id
                        }
                    }
                    categories {
                        category_id
                        name
                        criteria {
                            criteria_id
                            name
                            min_score
                            max_score
                        }
                    }
                }`
            }),
        });

        const json = await result.json();

        const categories: CategoryState[] = json.data.categories;
        const ballots: BallotState[] = json.data.getAllBallots;
        const projects: ProjectState[] = json.data.project;

        console.log(ballots, projects, categories);

        const categoriesState: { [categoryID: number]: {
            category: CategoryState;
            criteria: number[],
            projectBallots: { [projectID: number]: {
                ballots: BallotState[];
                individualScores: number[];
                score: number;
            }},
        }} = {};

        const criteriaToCategories: { [criteriaID: number]: number } = {};

        const projectsState = {};

        for (const project of projects) {
            projectsState[project.project_id] = project;
        }

        for (const category of categories) {
            categoriesState[category.category_id] = {
                category,
                criteria: category.criteria.map((criteria) => criteria.criteria_id),
                projectBallots: {},
            }

            for (const criteria of category.criteria) {
                criteriaToCategories[criteria.criteria_id] = category.category_id;
            }
        }

        console.log(criteriaToCategories);

        for (const ballot of ballots) {
            if (!categoriesState[criteriaToCategories[ballot.criteria_id]].projectBallots[ballot.project_id]) {
                categoriesState[criteriaToCategories[ballot.criteria_id]].projectBallots[ballot.project_id] = {
                    ballots: [],
                    individualScores: [],
                    score: 0,
                };
            }

            categoriesState[criteriaToCategories[ballot.criteria_id]].projectBallots[ballot.project_id].ballots.push(ballot);
        }

        for (const categoryID of Object.keys(categoriesState)) {
            const categoryValue = categoriesState[+categoryID];
            for (const projectID of Object.keys(categoryValue.projectBallots)) {
                const projectValue = categoryValue.projectBallots[+projectID];
                let score = 0;
                const individualJudgeScores = {};
                for (const ballotID of Object.keys(projectValue.ballots)) {
                    const ballotValue = projectValue.ballots[+ballotID];
                    if (ballotValue.ballot_status === 'Submitted') {
                        if (!individualJudgeScores[ballotValue.user_id!]) {
                            individualJudgeScores[ballotValue.user_id!] = 0;
                        }
                        individualJudgeScores[ballotValue.user_id!] += projectValue.ballots[+ballotID].score!;
                        score += projectValue.ballots[+ballotID].score!;
                    }
                }
                projectValue.score = score / Object.keys(individualJudgeScores).length || 0;

                for (const judgeID of Object.keys(individualJudgeScores)) {
                    projectValue.individualScores.push(individualJudgeScores[judgeID]);
                }
            }
        }

        console.log(categoriesState);

        this.setState((prevState) => {
            return {
                ...prevState,
                categoryRanking: categoriesState,
                projects: projectsState,
            };
        });
    }
}

export default AdminPanelRanking;


