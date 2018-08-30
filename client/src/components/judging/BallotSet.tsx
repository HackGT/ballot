import * as React from 'react';
// import './Judging.css';
import Criterion from './Criterion';
import { BallotState, BallotSetState } from '../../types/State';

interface BallotSetProps extends BallotSetState {
    updateBallot: (ballot: BallotState) => void;
    loadNextBallotSets: (nextBallotSet: BallotSetState) => void;
}

const BallotSet: React.SFC<BallotSetProps> = (props) => {
    // Check if there is any ballot set loaded. If not, fetch new ballot set
    function loadNext(mode: string, currentProjectID?: number): void {
        fetch('/auth/user_data/', { credentials: 'same-origin' })
        .then((result) => result.json())
        .then((userData) => {
            const user_id = userData.user_id;
            const query = `
                {
                    nextBallotSet(user_id: ${user_id} ${currentProjectID ? ', current_project_id: ' + currentProjectID : ''}) {
                        ballot_id,
                        project_id,
                        criteria_id,
                        judge_priority,
                        ballot_status
                    }
                    criteria {
                        criteria_id,
                        name,
                        rubric,
                        min_score,
                        max_score,
                        category_id
                    }
                    categories {
                        category_id,
                        name,
                        is_primary
                    }
                }
            `;
            fetch('/graphql', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            })
            .then((response) => response.json())
            .then((json) => {
                const nextBallotSet = json.data.nextBallotSet;
                if (mode === 'NO_LOAD_ON_EMPTY_RESPONSE'
                    && (nextBallotSet.length === 0)) {
                    return;
                }
                nextBallotSet.forEach((ballot: BallotState) => {
                    ballot.criteria = json.data.criteria
                    .filter((criterion: any) => {
                        return criterion.criteria_id
                            === ballot.criteria_id;
                    })[0];
                    ballot.criteria.category = json.data.categories
                    .filter((category: any) => {
                        return category.category_id
                            === ballot.criteria.category_id;
                    })[0];
                });
                props.loadNextBallotSets({ ballots: nextBallotSet });
            });
        });
    }

    if (props.ballots.length === 0) {
        loadNext('NO_LOAD_ON_EMPTY_RESPONSE', 10);
        return (
            <div>
                <p>There's currently no assigned project to view.</p>
            </div>
        );
    }
    return (
        <div>
            <h3>Category: {props.ballots[0].criteria.category.name}</h3>
            <h1>Project {props.ballots[0].project_id}</h1>
            <br />
            <hr />
            <br />
            {
                props.ballots.map((ballot) => {
                    return (
                        <Criterion
                            key={ballot.ballot_id}
                            ballot_id={ballot.ballot_id}
                            score={ballot.score}
                            criteria_id={ballot.criteria_id}
                            name={ballot.criteria.name}
                            rubric={ballot.criteria.rubric}
                            min_score={ballot.criteria.min_score}
                            max_score={ballot.criteria.max_score}
                            category_id={ballot.criteria.category_id}
                            onRate={(rating) => {
                                const newBallot = Object.assign(
                                    {}, ballot, { score: rating });
                                props.updateBallot(newBallot);
                            }}
                        />
                    );
                })
            }
            <button
                id='submit-ballots'
                className='SubmitButton'
                onClick={() => {
                    fetch('/auth/user_data/', { credentials: 'same-origin' })
                    .then((result) => result.json())
                    .then((userData) => {
                        let projectID = 0;
                        const user_id = userData.user_id;
                        const scores = props.ballots.map((ballot) => {
                            if (!ballot.score || ballot.score === 0) {
                                // TODO: No ballot score entry
                                // Shall we notify user?
                                ballot.score = 0;
                            }
                            projectID = ballot.project_id;
                            return {
                                ballot_id: ballot.ballot_id,
                                score: ballot.score,
                            };
                        });
                        const stringifiedScores
                            = JSON.stringify(scores).replace(/"/g, '');
                        const query = `
                            mutation {
                                scoreProject(
                                    user_id: ${user_id},
                                    scores: ${stringifiedScores}
                                ){
                                    score,
                                    score_submitted_at
                                }
                            }
                        `;
                        fetch('/graphql', {
                            credentials: 'same-origin',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ query }),
                        })
                        .then((response) => response.json())
                        .then((json) => {
                            // When successful, load the next
                            console.log(json);
                            loadNext('LOAD_ON_EMPTY_RESPONSE', projectID);
                        });
                    });
                }}
            >
                Submit Ballots
            </button>
        </div>
    );
};

export default BallotSet;
