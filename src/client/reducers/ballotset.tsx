import {
    LOAD_NEXT_BALLOT_SET,
    LoadNextBallotSetAction,
    UPDATE_BALLOT,
    UpdateBallotAction,
} from '../actions/ballotset';
import Action from '../types/Action';
import { BallotSetState } from '../types/State';
import { UpdateClassActionType } from '../types/UpdateClass';

// BallotState represents the current set of ballots that a judge is supposed to work on
const initState: BallotSetState = {
    ballots: [],
};

const ballot = (state: BallotSetState = initState, actionAny: Action): BallotSetState => {
    switch (actionAny.type) {
        case LOAD_NEXT_BALLOT_SET:
            const actionLoadNextBallotSet = actionAny as LoadNextBallotSetAction;
            return { ballots: actionLoadNextBallotSet.ballots };
        case UPDATE_BALLOT:
            const actionUpdateBallot = actionAny as UpdateBallotAction;
            return {
                ballots: [...state.ballots.filter((ballot) => ballot.ballot_id !== actionUpdateBallot.ballot.ballot_id), actionUpdateBallot.ballot],
            };
        default:
            return state;
    }
};

export default ballot;
