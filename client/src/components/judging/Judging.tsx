import * as React from 'react';
// import './Judging.css';
import ConnectedBallotSet from '../../containers/judging/ConnectedBallotSet';

interface JudgingProps {}

const Judging: React.SFC<JudgingProps> = (props) => {
    return (
        <ConnectedBallotSet />
    );
};

export default Judging;
