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

const projectJudgePenalty = (state, judgeID, projectID) => {
  let penalty = 1;

  const judge = state.canonical.users.get(judgeID);
  const judgeQueue = state.canonical.judgeQueues.get(judgeID);
  const activeProjectID = judgeQueue.get('activeProjectID');
  if (activeProjectID !== null) {
    const [ activeProjectGroup ] = state.canonical.projects.get(activeProjectID).get('table_number').split(' ');
    const [ testProjectGroup ] = state.canonical.projects.get(projectID).get('table_number').split(' ');

    if (activeProjectGroup !== testProjectGroup) {
      penalty *= 1.25;
    }
  }

  return penalty;
};

const autoAssignToJudge = (judgeID, state) => {
  const judgedProjects = state.canonical.judgedProjects.get(judgeID);
  const judgeQueues = state.canonical.judgeQueues.get(judgeID);
  const lowestHealth = state.derived.project_health
    .filter(
      (v, k) => !judgedProjects.has(k)
                  && judgeQueues.get('activeProjectID') !== k
                  && judgeQueues.get('queuedProjectID') !== k
                  && state.canonical.projects.get(k).expo_number === state.program.expo_number,
    )
    .map((health, projectID) => health * projectJudgePenalty(state, judgeID, projectID))
    .sort().keySeq().first();
  console.log(judgeID, lowestHealth);
  state.program.socket.emit('queue_project', {
    eventID: uuid(),
    userID: judgeID,
    projectID: lowestHealth,
  });
};

const canJudge = judge => {
  return judge.user_class !== 'Pending';
};

document.onkeydown = event => {
  // space
  if (event.keyCode === 0x20) {
    event.preventDefault();
    const state = store.getState();
    const emptyJudge = state.canonical.users.filter(
      judge =>
        state.canonical.judgeQueues.get(judge.user_id).get('queuedProjectID') === null
        && canJudge(judge),
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

  socket.on('skip_project', data => {
    store.dispatch({
      type: 'PROJECT_SKIPPED',
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
