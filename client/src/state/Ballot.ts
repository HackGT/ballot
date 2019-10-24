import uuidv4 from 'uuid/v4';

import Ballot, { BallotState, JudgeProjectBallotsMapping, BallotStatus, JudgeQueues, BallotObject, ProjectScoresMapping } from "../types/Ballot";
import Axios from 'axios';

export const FILL_BALLOTS = 'FILL_BALLOTS';
export const UPDATE_BALLOTS = 'UPDATE_BALLOTS';
export const DELETE_BALLOTS = 'DELETE_BALLOTS';
export const CLEAR_BALLOTS = 'CLEAR_BALLOTS';

export const QUEUE_PROJECT = 'QUEUE_PROJECT';
export const QUEUED_PROJECT = 'QUEUED_PROJECT';
export const SCORE_PROJECT = 'SCORE_PROJECT';
export const GOT_PROJECT = 'GOT_PROJECT';
export const BUSY_PROJECT = 'BUSY_PROJECT';
export const SKIP_PROJECT = 'SKIP_PROJECT';
export const MISSING_PROJECT = 'MISSING_PROJECT';

export function subscribeQueueProject() {
  return {
    event: 'project-queue',
    handle: QUEUE_PROJECT,
  };
}

export function unsubscribeQueueProject() {
  return {
    event: 'project-queue',
    leave: true,
  };
}

export function subscribeQueuedProject() {
  return {
    event: 'project-queued',
    handle: QUEUED_PROJECT,
  };
}

export function unsubscribeQueuedProject() {
  return {
    event: 'project-queued',
    leave: true,
  };
}

export function subscribeGetProject() {
  return {
    event: 'project-got',
    handle: GOT_PROJECT,
  };
}

export function subscribeScoreProject() {
  return {
    event: 'project-score',
    handle: SCORE_PROJECT,
  };
}

export function subscribeSkipProject() {
  return {
    event: 'project-skip',
    handle: SKIP_PROJECT,
  };
}

export function subscribeMissingProject() {
  return {
    event: 'project-missing',
    handle: MISSING_PROJECT,
  };
}

export function subscribeBusyProject() {
  return {
    event: 'project-busy',
    handle: BUSY_PROJECT,
  };
}

export function unsubscribeAll() {
  return {
    event: 'empty',
    leave: true,
  };
}

export function fillBallots(ballots: BallotObject) {
  return { type: FILL_BALLOTS, ballots };
}

export function updateBallots(ballots: BallotObject) {
  return { type: UPDATE_BALLOTS, ballots };
}

export function deleteBallots(ballotIDs: number[]) {
  return { type: DELETE_BALLOTS, ballotIDs };
}

export function clearBallots() {
  return { type: CLEAR_BALLOTS };
}

export function fetchBallots() {
  return async (dispatch: any) => {
    try {
      const result = await Axios.get('/api/ballots/allBallots');
      if (result.status) {
        const payload: BallotObject = result.data;
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

export function startBallots(userID: number, projectID: number) {
  return async (dispatch: any) => {
    try {
      const result = await Axios.post('/api/projects/startProject', {
        userID,
        projectID,
      });
      if (result.status) {
        const payload: BallotObject = result.data;
        dispatch(fillBallots(payload));
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  };
}

export function scoreBallots(ballots: { [ballotID: number]: number }) {
  return async (dispatch: any) => {
    try {
      console.log(ballots);
      const result = await Axios.post('/api/projects/scoreProject', {
        ballots,
      });

      console.log(result);
      if (result.status) {
        console.log('lsdkjflsdkjfsdljksdf');
        dispatch(clearBallots());
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  };
}

export function skipBallots(userID: number, projectID: number) {
  return async (dispatch: any) => {
    try {
      const result = await Axios.post('/api/projects/skip', {
        userID,
        projectID,
      });
      if (result.status) {
        const payload: BallotObject = result.data
        dispatch(clearBallots());
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  };
}

export function missingBallots(userID: number, projectID: number) {
  return async (dispatch: any) => {
    try {
      const result = await Axios.post('/api/projects/missing', {
        userID,
        projectID,
      });
      if (result.status) {
        const payload: BallotObject = result.data
        dispatch(clearBallots());
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  };
}

export function busyBallots(userID: number, projectID: number) {
  return async (dispatch: any) => {
    try {
      const result = await Axios.post('/api/projects/busy', {
        userID,
        projectID,
      });
      if (result.status) {
        const payload: BallotObject = result.data
        dispatch(clearBallots());
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  };
}

export function queueProject(projectID: number, userID: number) {
  return {
    type: 'QUEUE_PROJECT',
    result: {
      userID,
      projectID,
    }
  };
}

export function queueProjectEmit(projectID: number, userID: number) {
  console.log('wow', projectID, userID);
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
  dJudgeQueues: {},
  dJudgeProjectBallotsMap: {},
  dProjectScores: {},
}

export default function ballots(state: BallotState = initialBallotState, action: any) {
  switch (action.type) {
    case FILL_BALLOTS:
      const dJudgeProjectBallotsMap: JudgeProjectBallotsMapping = state.dJudgeProjectBallotsMap ? state.dJudgeProjectBallotsMap : {};
      const dJudgeQueues: JudgeQueues = state.dJudgeQueues ? state.dJudgeQueues : {};
      const dProjectScores: ProjectScoresMapping = state.dProjectScores ? state.dProjectScores : {};
      const ballots: { [ballotID: number]: Ballot } = action.ballots;
      for (const ballot of Object.values(ballots)) {
        if (!dJudgeProjectBallotsMap[ballot.userID]) {
          dJudgeProjectBallotsMap[ballot.userID] = {};
        }
        if (!dJudgeProjectBallotsMap[ballot.userID][ballot.projectID]) {
          dJudgeProjectBallotsMap[ballot.userID][ballot.projectID] = [];
        }

        if (!dProjectScores[ballot.projectID]) {
          dProjectScores[ballot.projectID] = {};
        }
        if (!dProjectScores[ballot.projectID][ballot.userID] && ballot.status === BallotStatus.Submitted) {
          dProjectScores[ballot.projectID][ballot.userID] = [];
        }

        dJudgeProjectBallotsMap[ballot.userID][ballot.projectID].push(ballot);
        if (ballot.status === BallotStatus.Submitted) {
          dProjectScores[ballot.projectID][ballot.userID].push(ballot);
        }
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
        const orderedJudgeBallots = Object.keys(dJudgeProjectBallotsMap[+judgeID]).sort((a: string, b: string) => {
          const dateA = new Date(dJudgeProjectBallotsMap[+judgeID][+a][0].updatedAt).getTime();
          const dateB = new Date(dJudgeProjectBallotsMap[+judgeID][+b][0].updatedAt).getTime();
          return dateA - dateB;
        });
        for (const projectID of orderedJudgeBallots) {
          const firstBallot = dJudgeProjectBallotsMap[+judgeID][+projectID][0];
          if (firstBallot.status === BallotStatus.Pending) {
            dJudgeQueues[+judgeID].queuedProject.id = +projectID;
          } else if (firstBallot.status === BallotStatus.Started || firstBallot.status === BallotStatus.Assigned) {
            dJudgeQueues[+judgeID].activeProjectID = +projectID;
          } else {
            dJudgeQueues[+judgeID].otherProjectIDs.push(+projectID);
          }
        }
      }

      console.log(dProjectScores);

      return {
        ...action.ballots,
        dJudgeProjectBallotsMap,
        dJudgeQueues,
        dProjectScores,
      };
    case UPDATE_BALLOTS:
      return {
        ...state,
        ...action.ballots,
      };
    case DELETE_BALLOTS:
      return action.ballotIDs.forEach((ballotID: number) => delete state[ballotID]);
    case QUEUE_PROJECT:
      console.log('queue', action);
      const judgeQueueObject = state.dJudgeQueues[action.result.userID];
      let dJudgeProjectBallotsMap1 = state.dJudgeProjectBallotsMap;
      if (!dJudgeProjectBallotsMap1[action.result.userID]) {
        dJudgeProjectBallotsMap1[action.result.userID] = {};
      }

      dJudgeProjectBallotsMap1 = {
        ...state.dJudgeProjectBallotsMap,
        [action.result.userID]: {
          ...state.dJudgeProjectBallotsMap[action.result.userID],
          [action.result.projectID]: {
            ...state.dJudgeProjectBallotsMap[action.result.userID][action.result.projectID],
          }
        }
      };

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
        dJudgeProjectBallotsMap: dJudgeProjectBallotsMap1,
      };
    case QUEUED_PROJECT:
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
        },
        dJudgeProjectBallotsMap: {
          ...state.dJudgeProjectBallotsMap,
          [action.result.userID]: {
            ...state.dJudgeProjectBallotsMap[action.result.userID],
            [action.result.projectID]: {
              ...state.dJudgeProjectBallotsMap[action.result.userID][action.result.projectID],
              ...action.result.newBallots,
            }
          }
        },
      }
      for (const removedBallotID of action.result.removedBallotIDs) {
        delete newState[removedBallotID];
      }

      return newState;
    case GOT_PROJECT:
      console.log(action.result);
      const firstKey = Object.keys(action.result.newBallots)[0];
      const firstBallot = action.result.newBallots[firstKey];
      const userID = firstBallot.userID;
      const projectID = firstBallot.projectID;
      return {
        ...state,
        ...action.result.newBallots,
        dJudgeProjectBallotsMap: {
          ...state.dJudgeProjectBallotsMap,
          [userID]: {
            ...state.dJudgeProjectBallotsMap[userID],
            [projectID]: {
              ...state.dJudgeProjectBallotsMap[userID][projectID],
              ...action.result.newBallots,
            },
          },
        },
        dJudgeQueues: {
          ...state.dJudgeQueues,
          [userID]: {
            ...state.dJudgeQueues[userID],
            queuedProject: undefined,
            activeProjectID: firstBallot.projectID,
          },
        },
      };
    case SCORE_PROJECT:
      console.log(action.result);
      const firstKey2 = Object.keys(action.result.newBallots)[0];
      const ballotsArray: Ballot[] = Object.values(action.result.newBallots);
      const firstBallot2 = action.result.newBallots[firstKey2];
      const userID2 = firstBallot2.userID;
      const projectID2 = firstBallot2.projectID;
      const otherProjectIDs = state.dJudgeQueues[userID2].otherProjectIDs;
      if (!otherProjectIDs.includes(projectID2)) {
        otherProjectIDs.push(projectID2);
      }

      let newDProjectScores = state.dProjectScores;

      if (!state.dProjectScores[projectID2]) {
        newDProjectScores[projectID2] = {};
      }

      if (!state.dProjectScores[projectID2][userID2]) {
        newDProjectScores[projectID2][userID2] = [];
      }

      newDProjectScores[projectID2][userID2].push(...ballotsArray);

      return {
        ...state,
        ...action.result.newBallots,
        dJudgeProjectBallotsMap: {
          ...state.dJudgeProjectBallotsMap,
          [userID2]: {
            ...state.dJudgeProjectBallotsMap[userID2],
            [projectID2]: {
              ...state.dJudgeProjectBallotsMap[userID2][projectID2],
              ...action.result.newBallots,
            },
          },
        },
        dJudgeQueues: {
          ...state.dJudgeQueues,
          [userID2]: {
            ...state.dJudgeQueues[userID2],
            activeProjectID: 0,
            otherProjectIDs,
          },
        },
        dProjectScores: newDProjectScores,
      };
    case CLEAR_BALLOTS:
      return initialBallotState;
    default:
      return state;
  }
}
