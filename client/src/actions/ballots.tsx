import { Dispatch } from 'redux';
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

export const loadNextBallotSets: (nextBallotSet: BallotState[])
    => LoadNextBallotSetAction = (nextBallotSet) => {
        return {
            type: LOAD_NEXT_BALLOT_SET,
            ballots: nextBallotSet,
        };
};

export const updateBallot: (ballot: BallotState)
    => UpdateBallotAction = (ballot: BallotState) => {
    return {
        type: UPDATE_BALLOT,
        ballot,
    };
};
