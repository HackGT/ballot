import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../../util/authorization';

import BallotsWrapper from '../../components/judging/BallotsWrapper';
import { loadNextBallotSets, updateBallot } from '../../actions/ballots';
import { refreshCategories } from '../../actions/categories';
import { refreshProjects } from '../../actions/projects';

import { State, AuthState, BallotState, ProjectState, CategoryState } from '../../types/State';
import Action from '../../types/Action';

interface StateToProps {
    auth: AuthState;
    ballots: BallotState[];
}

interface DispatchToProps {
    updateBallot: (ballot: BallotState) => void;
    loadNextBallotSets: (nextBallotSet: BallotState[]) => void;
}

const mapStateToProps = (state: State): StateToProps => {
    return {
        auth: state.auth,
        ballots: state.ballots,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        loadNextBallotSets: (nextBallotSet: BallotState[]) => {
            dispatch(loadNextBallotSets(nextBallotSet));
        },
        updateBallot: (ballot: BallotState) => {
            dispatch(updateBallot(ballot));
        },
    };
};

// const mapStateToAuth = (state: State): boolean => {
//     return state.auth.role === 'Judge';
// };

const BallotWrapperContainer = connect<StateToProps, DispatchToProps>(
    mapStateToProps,
    mapDispatchToProps
)(BallotsWrapper);

export default BallotWrapperContainer;
