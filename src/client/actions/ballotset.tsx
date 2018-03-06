import { Dispatch } from 'react-redux';
import { BallotState } from '../types/State';
import Action from '../types/Action';

export const LOAD_NEXT_BALLOT_SET = 'LOAD_NEXT_BALLOT_SET';
export const UPDATE_BALLOT = 'UPDATE_BALLOT';

export interface LoadNextBallotSetAction extends Action {
    ballots: BallotState[];
}

export interface UpdateBallotAction extends Action {
    ballot: BallotState;
}

export const loadNextBallotSets: () => LoadNextBallotSetAction = () => {
    // TODO: Dispatch a thunk, fetch through GraphQL with query nextBallotSet
    return {
        type: LOAD_NEXT_BALLOT_SET,
        ballots: [],
    };
};

export const updateBallot: (ballot: BallotState) => UpdateBallotAction = (ballot: BallotState) => {
    return {
        type: UPDATE_BALLOT,
        ballot,
    };
};
