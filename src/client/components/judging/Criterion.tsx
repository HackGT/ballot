import * as React from 'react';
// import Rater from 'react-rater'; // No type def yet
const Rater = require('react-rater').default;
import 'react-rater/lib/react-rater.css';
// import './Judging.scss';

interface CriterionProps {
    ballot_id: number;
    score?: number;
    criteria_id: number;
    name: string;
    rubric: string;
    min_score?: number;
    max_score?: number;
    catagory_id: number;
    onRate: (rating: number) => void;
}

// TODO: Move styling to CSS
// TODO: Make min_score actually useful
const Criterion: React.SFC<CriterionProps> = (props) => {
    return (
        <div>
            <h3 style={{ fontSize: '2em' }}>
                {props.name + ` ${props.score}/${props.max_score}`}
            </h3>
            <p style={{ fontSize: '1em' }}>{props.rubric}</p>
            <Rater
                style={{ fontSize: '3em' }}
                total={props.max_score}
                rating={props.score}
                onRate={(event: any) => {
                    if (event.type === 'click') {
                        props.onRate(event.rating);
                    }
                }}
            />
            <br />
        </div>
    );
};

Criterion.defaultProps = {
    score: 0,
    min_score: 0,
    max_score: 5,
};

export default Criterion;
