import * as React from 'react';
// import './Judging.scss';
import ConnectedBallotSet from '../../containers/judging/ConnectedBallotSet';

interface JudgingProps {}

const Judging: React.SFC<JudgingProps> = (props) => {
    return (
        <ConnectedBallotSet />
    );
};

export default Judging;
