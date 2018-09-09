import {
    LOAD_NEXT_BALLOT_SET,
    LoadNextBallotSetAction,
    UPDATE_BALLOT,
    UpdateBallotAction,
} from '../actions/ballots';
import Action from '../types/Action';
import { BallotState } from '../types/State';
import { UpdateClassActionType } from '../types/UpdateClass';

// BallotState represents the current set
// of ballots that a judge is supposed to work on

const ballots = (
    state: BallotState[] = [],
    actionAny: Action): BallotState[] => {
        switch (actionAny.type) {
            case LOAD_NEXT_BALLOT_SET:
                const actionLoadNextBallotSet
                    = actionAny as LoadNextBallotSetAction;
                return actionLoadNextBallotSet.ballots;
            case UPDATE_BALLOT:
                const actionUpdateBallot = actionAny as UpdateBallotAction;
                return state.map((ballot) => {
                    if (ballot.ballot_id
                        === actionUpdateBallot.ballot.ballot_id) {
                        return actionUpdateBallot.ballot;
                    }
                    return ballot;
                });
            default:
                return state;
        }
};

export default ballots;
