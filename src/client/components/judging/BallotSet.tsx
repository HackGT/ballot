import * as React from 'react';
// import './Judging.scss';
import Criterion from './Criterion';
import { BallotState, BallotSetState } from '../../types/State';

interface BallotSetProps extends BallotSetState {
    updateBallot: (ballot: BallotState) => void;
    loadNextBallotSets: () => void;
}

const BallotSet: React.SFC<BallotSetProps> = (props) => {
    if (props.ballots.length === 0) {
        // There's no ballot set to show
        return (
            <div>
                <p>There's no project to show at this moment.</p>
            </div>
        );
    }
    return (
        <div>
            <h3>Next</h3>
            <h1>Project {props.ballots[0].project_id}</h1>
            <br />
            <h2>Catagory: {props.ballots[0].criteria.catagory.name}</h2>
            <hr />
            <br />
            {
                props.ballots.map((ballot) => {
                    return (
                        <Criterion
                            ballot_id={ballot.ballot_id}
                            score={ballot.score}
                            criteria_id={ballot.criteria_id}
                            name={ballot.criteria.name}
                            rubric={ballot.criteria.rubric}
                            min_score={ballot.criteria.min_score}
                            max_score={ballot.criteria.max_score}
                            catagory_id={ballot.criteria.catagory_id}
                            onRate={(rating) => {
                                const newBallot = Object.assign({}, ballot, { score: rating });
                                props.updateBallot(newBallot);
                            }}
                        />
                    );
                })
            }
            {/* Add submit button */}
        </div>
    );
};

export default BallotSet;
