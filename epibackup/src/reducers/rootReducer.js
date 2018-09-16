import Immutable from 'immutable';

const BallotStatus = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  SUBMITTED: 'Submitted',
  SKIPPED: 'Skipped',
  STARTED: 'Started',
};

const Project = Immutable.Record({
  project_id: null,
  devpost_id: null,
  name: null,
  table_number: null,
  expo_number: null,
  sponsor_prizes: null,
  categories: [],
});

const Judge = Immutable.Record({
  user_id: null,
  email: null,
  name: null,
  user_class: null,
});

const Ballot = Immutable.Record({
  ballot_id: null,
  project_id: null,
  criteria_id: null,
  user_id: null,
  judge_priority: null,
  ballot_status: null,
  score: null,
  score_submitted_at: null,
});

const Criteria = Immutable.Record({
  criteria_id: null,
  name: null,
  rubric: null,
  min_score: null,
  max_score: null,
  category_id: null,
});

const Category = Immutable.Record({
  category_id: null,
  name: null,
  is_primary: null,
  criteria: [],
});

const CanonicalState = Immutable.Record({
  projects: Immutable.Map(),
  users: Immutable.Map(),
  ballots: Immutable.Map(),
  categories: Immutable.Map(),
  criteria: Immutable.Map(),
  judgeQueues: Immutable.Map(),
  judgedProjects: Immutable.Map(),
});

const DerivedState = Immutable.Record({
  /*
    judge_ballot_history: {
      [judge_id]: {
        [project_id]: [ballot_id, ballot_id, ...]
      }
    }
  */
  judge_ballot_history: Immutable.Map(),
});

const ProgramState = Immutable.Record({
  expo_number: 1,
  loadedState: false,
  selectedProjectID: null,
  socket: null,
  activeIconRefs: Immutable.Map(),
  queueIconRefs: Immutable.Map(),
  projectIconRefs: Immutable.Map(),
});

const State = Immutable.Record({
  canonical: new CanonicalState(),
  derived: new DerivedState(),
  program: new ProgramState(),
});

// deserialize into the Record structure
const deserializeCanonicalState = serializedState => {
  const projects = Immutable.OrderedMap().withMutations(map => {
    for (const projectId in serializedState.projects) {
      map.set(
        parseInt(projectId, 10),
        new Project(serializedState.projects[projectId]),
      );
    }
    map.sortBy(value => value.table_number);
  });

  const users = Immutable.Map().withMutations(map => {
    for (const judgeId in serializedState.users) {
      map.set(
        parseInt(judgeId, 10),
        new Judge(serializedState.users[judgeId]),
      );
    }
  });

  const ballots = Immutable.Map().withMutations(map => {
    for (const ballotId in serializedState.ballots) {
      map.set(
        parseInt(ballotId, 10),
        deserializeBallot(serializedState.ballots[ballotId]),
      );
    }
  });

  // let it be known that I protested using the plural "criteria" here
  const criteria = Immutable.Map().withMutations(map => {
    for (const criteriaId in serializedState.criteria) {
      map.set(
        parseInt(criteriaId, 10),
        new Criteria(serializedState.criteria[criteriaId]),
      );
    }
  });

  const categories = Immutable.Map().withMutations(map => {
    for (const categoryId in serializedState.categories) {
      map.set(
        parseInt(categoryId, 10),
        new Category(serializedState.categories[categoryId]),
      );
    }
  });

  const judgeQueues = Immutable.Map().withMutations(map => {
    for (const judgeId in serializedState.judgeQueues) {
      map.set(
        parseInt(judgeId, 10),
        Immutable.Map(serializedState.judgeQueues[judgeId]),
      );
    }
  });

  const judgedProjects = Immutable.Map().withMutations(map => {
    for (const judgeId in serializedState.judgedProjects) {
      map.set(
        parseInt(judgeId, 10),
        Immutable.OrderedSet(serializedState.judgedProjects[judgeId]),
      );
    }
  });

  return new CanonicalState({
    projects,
    users,
    ballots,
    criteria,
    categories,
    judgeQueues,
    judgedProjects,
  });
};

const computeFullDerivedState = canonicalState => {
  const { ballots } = canonicalState;

  const judge_ballot_history =
    ballots
      .keySeq()
      .groupBy(ballot_id => ballots.get(ballot_id).user_id)
      .map(judge_ballots => judge_ballots
        .groupBy(judge_ballot_id => ballots.get(judge_ballot_id).project_id));

  return new DerivedState({
    judge_ballot_history,
  });
}

const deserializeBallot = ballot => {
  return new Ballot({
    ...ballot,
    score_submitted_at: new Date(ballot.score_submitted_at),
  });
};

const rootReducer = (state = new State(), action) => {
  const handlers = {
    'FULL_SYNC': (state, action) => {
      // if canonical state is what we think it is, ignore! no need to derive state
      if (JSON.stringify(state.canonical) === JSON.stringify(action.serializedState)) {
        return state;
      }

      console.error(
        'State was out of sync',
        state.canonical,
        action.serializedState,
      );

      return state.withMutations(state => {
        const canonicalState = deserializeCanonicalState(action.serializedState);

        state
          .set(
            'canonical',
            canonicalState,
          )
          .set(
            'derived',
            computeFullDerivedState(canonicalState),
          )
          .setIn([
            'program',
            'loadedState',
          ], true);
      });
    },
    'ENQUEUE_PROJECT': (state, action) => {
      return state.setIn([
        'canonical',
        'judgeQueues',
        action.userID,
        'queuedProjectID',
      ], action.projectID);
    },
    'REMOVE_PROJECT_FROM_QUEUE': (state, action) => {
      return state.setIn([
        'canonical',
        'judgeQueues',
        action.userID,
        'queuedProjectID',
      ], null);
    },
    'PULL_PROJECT_FROM_QUEUE': (state, action) => {
      return state.withMutations(state => {
        state.setIn([
          'canonical',
          'judgeQueues',
          action.userID,
          'activeProjectID',
        ], action.projectID);
        state.setIn([
          'canonical',
          'judgeQueues',
          action.userID,
          'queuedProjectID',
        ], null);
      });
    },
    'SKIP_PROJECT': (state, action) => {
      return state.setIn([
        'canonical',
        'judgeQueues',
        action.userID,
        'activeProjectID',
      ], null);
    },
    'PROJECT_SCORED': (state, action) => {
      const s = state.withMutations(state => {
        for (const ballot of action.ballots) {
          state.setIn([
            'canonical',
            'ballots',
            ballot.ballot_id,
          ], deserializeBallot(ballot));
        }

        if (
          !state.derived.judge_ballot_history.has(action.userID)
          || !state.derived.judge_ballot_history.get(action.userID).has(action.projectID)
        ) {
          state.setIn([
            'derived',
            'judge_ballot_history',
            action.userID,
            action.projectID,
          ], Immutable.List());
        }
        state.updateIn([
          'derived',
          'judge_ballot_history',
          action.userID,
          action.projectID,
        ], list => list.concat(action.ballots.map(deserializeBallot)));

        if (!state.canonical.judgedProjects.has(action.userID)) {
          state.setIn([
            'canonical',
            'judgedProjects',
            action.userID,
          ], Immutable.OrderedSet());
        }

        state.updateIn([
          'canonical',
          'judgedProjects',
          action.userID,
        ], set => set.add(action.projectID));

        state.setIn([
          'canonical',
          'judgeQueues',
          action.userID,
          'activeProjectID',
        ], null);
      });
      console.log(action.userID, s.canonical.judgeQueues.get(action.userID).get('activeProjectID'));
      return s;
    },

    'SET_ACTIVE_ICON_REF': (state, action) => {
      return state.setIn([
        'program',
        'activeIconRefs',
        action.judgeID,
      ], action.ref);
    },
    'SET_QUEUE_ICON_REF': (state, action) => {
      return state.setIn([
        'program',
        'queueIconRefs',
        action.judgeID,
      ], action.ref);
    },
    'SET_PROJECT_ICON_REF': (state, action) => {
      return state.setIn([
        'program',
        'projectIconRefs',
        action.projectID,
      ], action.ref);
    },

    'SET_SELECTED_PROJECT': (state, action) => {
      return state.setIn([
        'program',
        'selectedProjectID',
      ], action.projectID);
    },

    'SET_SOCKET': (state, action) => {
      return state.setIn([
        'program',
        'socket',
      ], action.socket);
    },
  };

  if (action.type in handlers) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
};

export default rootReducer;