import uuidv4 from 'uuid/v4';

import Ballot, { BallotState, JudgeProjectBallotsMapping, BallotStatus, JudgeQueues } from "../types/Ballot";
import Axios from 'axios';

export const FILL_BALLOTS = 'FILL_BALLOTS';
export const UPDATE_BALLOTS = 'UPDATE_BALLOTS';
export const DELETE_BALLOTS = 'DELETE_BALLOTS';

export const QUEUED_PROJECT = 'QUEUED_PROJECT';

export function fillBallots(ballots: BallotState) {
  return { type: FILL_BALLOTS, ballots };
}

export function updateBallots(ballots: BallotState) {
  return { type: UPDATE_BALLOTS, ballots };
}

export function deleteBallots(ballotIDs: number[]) {
  return { type: DELETE_BALLOTS, ballotIDs };
}

export function fetchBallots() {
  return async (dispatch: any) => {
    try {
      const result = await Axios.get('/api/ballots/allBallots');
      if (result.status) {
        const payload: BallotState = result.data;
        dispatch(fillBallots(payload));
      } else {
        throw new Error('API Error');
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  };
}

export function subscribeQueuedProject() {
  return {
    event: 'project-queued',
    handle: QUEUED_PROJECT,
  };
}

export function queueProject(projectID: number, userID: number) {
  return {
    event: 'project-queue',
    emit: true,
    payload: {
      eventID: uuidv4(),
      projectID,
      userID,
    },
  };
}

const initialBallotState: BallotState = {
  dJudgeQueues: [],
  dJudgeProjectBallotsMap: {},
}

export default function ballots(state: BallotState = initialBallotState, action: any) {
  switch (action.type) {
    case FILL_BALLOTS:
      const dJudgeProjectBallotsMap: JudgeProjectBallotsMapping = {};
      const dJudgeQueues: JudgeQueues = {};
      const ballots: { [ballotID: number]: Ballot } = action.ballots;
      for (const ballot of Object.values(ballots)) {
        if (!dJudgeProjectBallotsMap[ballot.userID]) {
          dJudgeProjectBallotsMap[ballot.userID] = {};
        }

        if (!dJudgeProjectBallotsMap[ballot.userID][ballot.projectID]) {
          dJudgeProjectBallotsMap[ballot.userID][ballot.projectID] = [];
        }

        dJudgeProjectBallotsMap[ballot.userID][ballot.projectID].push(ballot);
      }

      for (const judgeID of Object.keys(dJudgeProjectBallotsMap)) {
        dJudgeQueues[+judgeID] = {
          queuedProject: {
            id: 0,
            pending: false,
          },
          activeProjectID: 0,
          otherProjectIDs: [],
        };
        for (const projectID of Object.keys(dJudgeProjectBallotsMap[+judgeID])) {
          const firstBallot = dJudgeProjectBallotsMap[+judgeID][+projectID][0];
          if (firstBallot.status === BallotStatus.Assigned) {
            dJudgeQueues[+judgeID].queuedProject.id = +projectID;
          } else if (firstBallot.status === BallotStatus.Started) {
            dJudgeQueues[+judgeID].activeProjectID = +projectID;
          } else {
            dJudgeQueues[+judgeID].otherProjectIDs.push(+projectID);
          }
        }
      }
      const newState = {
        ...action.ballots,
        dJudgeProjectBallotsMap,
        dJudgeQueues,
      };
      return newState;
    case UPDATE_BALLOTS:
      return {
        ...state,
        ...action.ballots,
      };
    case DELETE_BALLOTS:
      return action.ballotIDs.forEach((ballotID: number) => delete state[ballotID]);
    case QUEUED_PROJECT:
      console.log(action);
      if (action.result.done) {
        const newState = {
          ...state,
          ...action.result.newBallots,
          dJudgeQueues: {
            ...state.dJudgeQueues,
            [action.result.userID]: {
              ...state.dJudgeQueues[action.result.userID],
              queuedProject: {
                id: action.result.projectID,
                pending: false,
              }
            },
          }
        }
        for (const removedBallotID of action.result.removedBallotIDs) {
          delete newState[removedBallotID];
        }

        return newState;
      } else {
        const judgeQueueObject = state.dJudgeQueues[action.result.userID];
        return {
          ...state,
          dJudgeQueues: {
            ...state.dJudgeQueues,
            [action.result.userID]: {
              ...judgeQueueObject,
              activeProjectID: judgeQueueObject ? judgeQueueObject.activeProjectID : 0,
              otherProjectIDs: judgeQueueObject ? judgeQueueObject.otherProjectIDs : [],
              queuedProject: {
                id: action.result.projectID,
                pending: true,
              }
            },
          },
        };
      }
    default:
      return state;
  }
}
