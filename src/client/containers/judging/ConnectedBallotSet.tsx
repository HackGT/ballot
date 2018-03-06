import { connect, Dispatch } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../../util/authorization';

import BallotSet from '../../components/judging/BallotSet';
import { loadNextBallotSets, updateBallot } from '../../actions/ballotset';

import { State, BallotSetState, BallotState } from '../../types/State';

interface StateToProps extends BallotSetState {}
interface DispatchToProps {
    updateBallot: (ballot: BallotState) => void;
    loadNextBallotSets: () => void;
}

const mapStateToProps = (state: State): StateToProps => {
    return {
        ballots: state.ballotset.ballots,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        loadNextBallotSets: () => { dispatch(loadNextBallotSets()); },
        updateBallot: (ballot: BallotState) => { dispatch(updateBallot(ballot)); },
    };
};

// const mapStateToAuth = (state: State): boolean => {
//     return state.auth.role === 'Judge';
// };

const ConnectedBallotSet = connect<StateToProps, DispatchToProps>(
    mapStateToProps,
    mapDispatchToProps
)(BallotSet);

export default ConnectedBallotSet;
