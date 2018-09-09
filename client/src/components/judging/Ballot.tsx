import * as React from 'react';
import { H4, Slider } from '@blueprintjs/core';
import { BallotState, CriteriaState } from '../../types/State';

interface BallotProps {
    criteria: CriteriaState;
    ballot: BallotState;
    updateBallot: (ballot: BallotState) => void;
}

const Ballot: React.SFC<BallotProps> = (props) => {
    const updateBallot = (value: number) => {
        const newBallot = props.ballot;
        newBallot.score = value;
        props.updateBallot(newBallot);
    };

    return (
        <div style={{
            margin: '20px 0 20px',
        }}>
            <H4>{props.criteria.name}</H4>
            <div style={{
                width: '95%',
                maxWidth: '500px',
                margin: '0 auto',
                textAlign: 'left',
            }}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{props.criteria.rubric}</p>
                <Slider
                    min={props.criteria.min_score}
                    max={props.criteria.max_score}
                    onChange={updateBallot}
                    value={props.ballot.score} />
            </div>
        </div>
    );
};

export default Ballot;
