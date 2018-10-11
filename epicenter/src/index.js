import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import './css/index.css';
import AppContainer from './components/containers/AppContainer.react';

import { createStore } from 'redux';
import MaybeProjectIcon from './components/MaybeProjectIcon.react';

import io from 'socket.io-client';
import uuid from 'uuid/v4';

const store = createStore(rootReducer);

const animateProject = (fromRef, toRef, oldProject, newProject, duration) => {
  const phonyElement = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <MaybeProjectIcon project={oldProject} />
    </Provider>,
    phonyElement,
  );
  phonyElement.style.position = 'absolute';
  phonyElement.style.top = toRef.offsetTop + 'px';
  phonyElement.style.left = toRef.offsetLeft + 'px';
  phonyElement.style.zIndex = '1';

  toRef.style.visibility = 'hidden';

  const animatedElement = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <MaybeProjectIcon project={newProject} />
    </Provider>,
    animatedElement,
  );
  animatedElement.style.position = 'absolute';
  animatedElement.style.top = fromRef.offsetTop + 'px';
  animatedElement.style.left = fromRef.offsetLeft + 'px';
  animatedElement.style.zIndex = '2';
  animatedElement.style.transition = `all ${duration}ms`;

  window.setTimeout(() => {
    animatedElement.style.top = toRef.offsetTop + 'px';
    animatedElement.style.left = toRef.offsetLeft + 'px';
  }, 0);

  window.setTimeout(() => {
    phonyElement.remove();
    animatedElement.remove();
    toRef.style.visibility = 'visible';
  }, duration);

  document.body.appendChild(phonyElement);
  document.body.appendChild(animatedElement);
};

const animateProjectToQueue = (projectID, judgeID) => {
  const state = store.getState();

  const projectIconRef = state.program.projectIconRefs.get(projectID);
  const queueIconRef = state.program.queueIconRefs.get(judgeID);

  const oldProject = state.canonical.projects.get(
    state.canonical.judgeQueues.get(judgeID).get('queuedProjectID'),
  );

  const newProject = state.canonical.projects.get(projectID);

  animateProject(projectIconRef, queueIconRef, oldProject, newProject, 250);
};

const animatePullProject = judgeID => {
  const state = store.getState();

  const queueIconRef = state.program.queueIconRefs.get(judgeID);
  const activeIconRef = state.program.activeIconRefs.get(judgeID);

  const oldProject = state.canonical.projects.get(
      state.canonical.judgeQueues.get(judgeID).get('activeProjectID'),
    );

  const newProject = state.canonical.projects.get(
      state.canonical.judgeQueues.get(judgeID).get('queuedProjectID'),
    );

  animateProject(queueIconRef, activeIconRef, oldProject, newProject, 250);
};

// TODO: move this
const onQueueProject = data => {
  animateProjectToQueue(data.projectID, data.userID);

  store.dispatch({
    type: 'ENQUEUE_PROJECT',
    userID: data.userID,
    projectID: data.projectID,
  });
};

const onNextProject = data => {
  animatePullProject(data.userID);

  store.dispatch({
    type: 'PULL_PROJECT_FROM_QUEUE',
    userID: data.userID,
    projectID: data.projectID,
  });
};

// const steps = [
//   () => onQueueProject({
//     userID: 10,
//     projectID: 2040,
//   }),

//   () => onQueueProject({
//     userID: 11,
//     projectID: 2102,
//   }),

//   () => onQueueProject({
//     userID: 12,
//     projectID: 2096,
//   }),

//   () => onNextProject({
//     userID: 10,
//     projectID: 2040,
//   }),

//   () => onQueueProject({
//     userID: 13,
//     projectID: 2037,
//   }),

//   () => onNextProject({
//     userID: 12,
//     projectID: 2096,
//   }),

//   () => onQueueProject({
//     userID: 14,
//     projectID: 2112,
//   }),

//   () => onNextProject({
//     userID: 11,
//     projectID: 2102,
//   }),

//   () => onQueueProject({
//     userID: 10,
//     projectID: 2110,
//   }),

//   () => onNextProject({
//     userID: 13,
//     projectID: 2037,
//   }),

//   () => onQueueProject({
//     userID: 11,
//     projectID: 2088,
//   }),

//   () => onQueueProject({
//     userID: 12,
//     projectID: 2066,
//   }),

//   () => onNextProject({
//     userID: 14,
//     projectID: 2112,
//   }),

//   () => onQueueProject({
//     userID: 13,
//     projectID: 2069,
//   }),

//   () => onQueueProject({
//     userID: 14,
//     projectID: 2039,
//   }),

  // () => onNextProject({
  //   userID: 12,
  //   projectID: 2037,
  // }),

  // () => onQueueProject({
  //   userID: 12,
  //   projectID: 2087,
  // }),

  // () => onQueueProject({
  //   userID: 12,
  //   projectID: 2100,
  // }),

  // () => onQueueProject({
  //   userID: 12,
  //   projectID: 2087,
  // }),

  // () => onQueueProject({
  //   userID: 12,
  //   projectID: 2100,
  // }),

  // () => onQueueProject({
  //   userID: 12,
  //   projectID: 2087,
  // }),

  // () => onQueueProject({
  //   userID: 12,
  //   projectID: 2100,
  // }),
// ];

// for (let i = 0; i < steps.length; i++) {
//   window.setTimeout(steps[i], 300 * (i + 1));
// }

const projectJudgePenalty = (judgeID, projectID) => {
  let penalty = 1;

  return penalty;
};

const autoAssignToJudge = (judgeID, state) => {
  // todo: queued and active
  const judgedProjects = state.canonical.judgedProjects.get(judgeID);
  const judgeQueues = state.canonical.judgeQueues.get(judgeID);
  const lowestHealth = state.derived.project_health
    .filter(
      (v, k) => !judgedProjects.has(k)
                  && judgeQueues.get('activeProjectID') !== k
                  && judgeQueues.get('queuedProjectID') !== k
                  && state.canonical.projects.get(k).expo_number === state.program.expo_number,
    )
    .map((health, projectID) => health * projectJudgePenalty(judgeID, projectID))
    .sort().keySeq().first();
  console.log(judgeID, lowestHealth);
  state.program.socket.emit('queue_project', {
    eventID: uuid(),
    userID: judgeID,
    projectID: lowestHealth,
  });
};

document.onkeydown = event => {
  // space
  if (event.keyCode === 0x20) {
    event.preventDefault();
    const state = store.getState();
    const emptyJudge = state.canonical.users.filter(
      judge =>
        state.canonical.judgeQueues.get(judge.user_id).get('queuedProjectID') === null
        && judge.user_class !== 'Pending',
    ).first();
    if (emptyJudge) {
      autoAssignToJudge(emptyJudge.user_id, state);
    }
  }
};

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'),
);

const socket = io();
socket.on('connect', () => {
  store.dispatch({
    type: 'SET_SOCKET',
    socket,
  });

  socket.emit('start', {
    eventID: uuid(),
    password: window.prompt('What is password?'),
  });

  socket.on('queue_project', ({ userID, projectID }) => {
    onQueueProject({ userID, projectID });
  });

  socket.on('next_project', ({ userID, projectID }) => {
    onNextProject({ userID, projectID });
  });

  socket.on('score_project', data => {
    store.dispatch({
      type: 'PROJECT_SCORED',
      ...data,
    });
  });

  socket.on('all_data', data => {
    store.dispatch({
      type: 'FULL_SYNC',
      serializedState: data,
    });
  });
});
