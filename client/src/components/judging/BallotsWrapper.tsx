import * as React from 'react';
import Criterion from './Criterion';
import { H1, H2, H6, Spinner, Button } from '@blueprintjs/core';
import { AuthState, BallotState, CategoryState, ProjectState } from '../../types/State';
import Ballots from './Ballots';

interface BallotSetProps {
    updateBallot: (ballot: BallotState) => void;
    loadNextBallotSets: (nextBallotSet: BallotState[]) => void;
}

interface BallotsWrapperProps {
    auth: AuthState;
    ballots: BallotState[];
    updateBallot: (ballot: BallotState) => void;
    loadNextBallotSets: (nextBallotSet: BallotState[]) => void;
}

interface BallotsWrapperState {
    criteriaToBallot: { [criteriaID: number]: BallotState };
    currentProject: ProjectState | undefined;
    fetching: boolean;
    done: boolean;
}

const SPINNER_SIZE = 100;

const successStatements: string[] = [
    `You're doing great!`,
    `You're blowing our socks off!`,
    `Great job!`,
    `Awesome!`,
    `Beep beep, I'm a sheep`,
];

class BallotsWrapper extends React.Component<BallotsWrapperProps, BallotsWrapperState> {
    constructor(props: BallotsWrapperProps) {
        super(props);

        this.state = {
            criteriaToBallot: {},
            currentProject: undefined,
            fetching: true,
            done: false,
        };

        this.startProject = this.startProject.bind(this);
        this.skipProject = this.skipProject.bind(this);
        this.submitScores = this.submitScores.bind(this);
        this.fetchNextProjectBallots = this.fetchNextProjectBallots.bind(this);
    }

    public async componentDidMount() {
        await this.fetchNextProjectBallots();
    }

    public render() {
        if (this.state.fetching) {
            return (
                <div>
                    <div style={{
                        width: '100%',
                    }}>
                        <div style={{
                            width: SPINNER_SIZE,
                            margin: '20px auto',
                        }}>
                            <Spinner size={SPINNER_SIZE} />
                        </div>
                        <H6 style={{
                            textAlign: 'center',
                        }}>
                            Loading next project...
                        </H6>
                    </div>
                </div>
            );
        } else if (this.state.done) {
            const statementIndex = Math.floor(Math.random() * successStatements.length);
            const statement = successStatements[statementIndex];

            return (
                <div style={{
                    textAlign: 'center',
                }}>
                    <H1>{statement}</H1>
                    <p>Your ballots have been submitted, and have been sent to Epicenter.</p>

                    <Button
                        text='Next Project'
                        intent='primary'
                        large={true}
                        onClick={this.fetchNextProjectBallots} />
                </div>
            )
        } else {
            return (
                <div>
                    {this.props.ballots.length > 0 && this.state.currentProject ?
                        <Ballots
                            ballotStatus={this.props.ballots[0].ballot_status}
                            project={this.state.currentProject!}
                            criteriaToBallot={this.state.criteriaToBallot}
                            startProject={this.startProject}
                            updateBallot={this.props.updateBallot}
                            scoreProject={this.submitScores}
                            skipProject={this.skipProject} /> :
                        <div style={{
                            textAlign: 'center',
                        }}>
                            <p>There is no project currently assigned to you.</p>
                            <p>Press refresh below to check if there are more projects.</p>
                            <Button
                                text='Refresh'
                                intent='primary'
                                onClick={this.fetchNextProjectBallots}
                                large={true} />
                        </div>}
                </div>
            )
        }
    }

    private async fetchNextProjectBallots() {
        this.setState((prevState) => {
            return {
                ...prevState,
                fetching: true,
            };
        });

        const ballotsResult = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                    nextBallotSet(user_id: ${this.props.auth.user_id}) {
                        project {
                            project_id,
                            devpost_id,
                            name,
                            table_number
                            expo_number
                            sponsor_prizes
                            categories {
                                category_id,
                                name,
                                is_primary,
                                criteria {
                                    criteria_id,
                                    name,
                                    rubric,
                                    min_score,
                                    max_score,
                                    category_id,
                                }
                            }
                        }
                        ballots {
                            ballot_id,
                            project_id,
                            criteria_id,
                            judge_priority,
                            ballot_status
                        }
                    }
                }`
            })
        });

        const ballotsJSON = await ballotsResult.json();
        console.log(ballotsJSON.data);

        if (ballotsJSON.data.nextBallotSet) {
            const ballots = ballotsJSON.data.nextBallotSet.ballots;
            const project = ballotsJSON.data.nextBallotSet.project;

            const criteriaToBallot: { [criteriaID: number]: BallotState } = {};
            for (const ballot of ballots) {
                criteriaToBallot[ballot.criteria_id] = ballot;
            }

            this.setState((prevState) => {
                return {
                    ...prevState,
                    currentProject: project,
                    criteriaToBallot,
                };
            });

            this.props.loadNextBallotSets(ballots);
        } else {
            this.props.loadNextBallotSets([]);
        }

        this.setState((prevState) => {
            return {
                ...prevState,
                fetching: false,
                done: false,
            };
        });
    }

    private async submitScores() {
        for (const ballot of this.props.ballots) {
            if (ballot.score === undefined) {
                return;
            }
        }

        const submitScoresResult = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation {
                    scoreProject(
                        user_id: ${this.props.auth.user_id}
                        project_id: ${this.state.currentProject!.project_id}
                        scores: [${
                            this.props.ballots.map((ballot) => {
                                return `{
                                    ballot_id: ${ballot.ballot_id}
                                    score: ${ballot.score}
                                }`
                            })
                        }]
                    )
                }`
            }),
        });

        const submitScoresResultJSON = await submitScoresResult.json();
        if (submitScoresResultJSON.data.scoreProject) {
            this.props.loadNextBallotSets([]);
            this.setState((prevState) => {
                return {
                    ...prevState,
                    criteriaToBallot: {},
                    done: true,
                    fetching: false,
                };
            });
        }
    }

    private async skipProject() {
        const skipProjectResult = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation {
                    skipProject(
                        user_id: ${this.props.auth.user_id}
                        project_id: ${this.state.currentProject!.project_id}
                    )
                }`
            }),
        });

        const skipProjectResultJSON = await skipProjectResult.json();
        if (skipProjectResultJSON.data.skipProject) {
            this.props.loadNextBallotSets([]);
            this.setState((prevState) => {
                return {
                    ...prevState,
                    criteriaToBallot: {},
                    done: true,
                    fetching: false,
                };
            });
        }
    }

    private async startProject() {
        console.log('start');
        const ballotsResult = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation {
                    startProject(
                        user_id: ${this.props.auth.user_id}
                        project_id: ${this.state.currentProject!.project_id}
                    )
                }`
            })
        });

        const data = (await ballotsResult.json()).data;

        console.log(data);

        if (data.startProject) {
            const newCriteriaToBallots: { [criteriaID: number]: BallotState } = {};
            for (const ballot of this.props.ballots) {
                const newBallot = ballot;
                newBallot.ballot_status = 'Started';
                newCriteriaToBallots[newBallot.criteria_id] = newBallot;
                this.props.updateBallot(newBallot);
            }

            this.setState((prevState) => {
                return {
                    ...prevState,
                    criteriaToBallot: newCriteriaToBallots,
                };
            });
        }
    }
}

export default BallotsWrapper;
