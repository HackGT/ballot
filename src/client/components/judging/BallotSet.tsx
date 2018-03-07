import * as React from 'react';
// import './Judging.scss';
import Criterion from './Criterion';
import { BallotState, BallotSetState } from '../../types/State';
import './SubmitButton.scss';

interface BallotSetProps extends BallotSetState {
    updateBallot: (ballot: BallotState) => void;
    loadNextBallotSets: (nextBallotSet: BallotSetState) => void;
}

const BallotSet: React.SFC<BallotSetProps> = (props) => {
    // Check if there is any ballot set loaded. If not, fetch new ballot set
    if (props.ballots.length === 0) {
        fetch('/auth/user_data/', { credentials: 'same-origin' })
            .then((result) => result.json())
            .then((userData) => {
                // TODO: understand why userid is not being fetched correctly
                const userid = userData.userid;
                const query = `
                    {
                        nextBallotSet(user_id: ${userid}) {
                            ballot_id,
                            project_id,
                            criteria_id,
                            user_id,
                            judge_priority,
                            ballot_status
                        }
                    }
                `;
                fetch('/graphql', {
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // body: JSON.stringify({
                    //     query: query.replace(/\s/g, ''),
                    // }),
                    body: JSON.stringify({ query }),
                })
                .then((response) => response.json())
                .then((json) => {
                    // const nextBallotSet = json.data.nextBallotSet;
                    // if (!nextBallotSet || nextBallotSet.length === 0) {
                    //     return;
                    // }
                    // props.loadNextBallotSets(nextBallotSet);

                    // For Testing:
                    props.loadNextBallotSets({
                        ballots: [
                            {
                                ballot_id: 2,
                                project_id: 30,
                                criteria_id: 1,
                                user_id: 1,
                                judge_priority: 1,
                                ballot_status: 'Assigned',
                                criteria: {
                                    name: 'Use of Tensorflow',
                                    rubric: 'This is a sample rubric blah blah',
                                    catagory_id: 1,
                                    catagory: {
                                        name: 'Machine Learning Track',
                                        is_primary: true,
                                    },
                                },
                            },
                            {
                                ballot_id: 3,
                                project_id: 30,
                                criteria_id: 2,
                                user_id: 1,
                                judge_priority: 1,
                                ballot_status: 'Assigned',
                                criteria: {
                                    name: 'Use of Scikit-learn',
                                    rubric: 'This is a sample rubric lol lol',
                                    catagory_id: 1,
                                    catagory: {
                                        name: 'Machine Learning Track',
                                        is_primary: true,
                                    },
                                },
                            },
                        ],
                    });
                });
            });
        return (
            <div>
                <p>There's currently no assigned project to view.</p>
            </div>
        );
    }
    return (
        <div>
            <h3>Catagory: {props.ballots[0].criteria.catagory.name}</h3>
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
                            catagory_id={ballot.criteria.catagory_id}
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
                    console.log('Submit Ballots');
                }}
            >
                Submit Ballots
            </button>
        </div>
    );
};

export default BallotSet;
