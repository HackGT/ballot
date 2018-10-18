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
  /*
    project_ballots: {
      [project_id]: {
        [judge_id]: [ballot_id, ballot_id, ...]
      }
    }
  */
  project_ballots: Immutable.Map(),
  /*
    project_queues: {
      [project_id]: [judge_id, judge_id, ... ]
    }
  */
  project_queues: Immutable.Map(),
  /*
      project_assignments: {
        [project_id]: [judge_id, judge_id, ... ]
      }
    */
  project_assignments: Immutable.Map(),
  /*
    project_health: {
      [project_id]: number,
    }
  */
  project_health: Immutable.Map(),
  /*
    project_scores: {
      [project_id]: {
        [category_id]: [number, number],  // mean, sstdev
        "overall": [number, number],    // score for every primary category
      },
    }
  */
  project_scores: Immutable.Map(),
});

const ProgramState = Immutable.Record({
  expo_number: 1,
  loadedState: false,
  selectedProjectID: null,
  socket: null,
  leftPane: 'overview',
  activeIconRefs: Immutable.Map(),
  queueIconRefs: Immutable.Map(),
  projectIconRefs: Immutable.Map(),
  excludedJudges: Immutable.Set(),
  selectedJudge: 0,
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
      if (serializedState.ballots[ballotId].ballot_status === 'Pending'
          || serializedState.ballots[ballotId].ballot_status === 'Skipped') {
            continue; // I DON'T WANT IT
          }
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
    for (const judgeId in serializedState.users) {
      map.set(
        parseInt(judgeId, 10),
        Immutable.Map({ activeProjectID: null, queuedProjectID: null }),   // empty map first
      );
    }
    for (const judgeId in serializedState.judgeQueues) {
      map.set(
        parseInt(judgeId, 10),
        Immutable.Map(serializedState.judgeQueues[judgeId]),
      );
    }
  });

  const judgedProjects = Immutable.Map().withMutations(map => {
    for (const judgeId in serializedState.users) {
      map.set(
        parseInt(judgeId, 10),
        Immutable.OrderedSet(),
      );
    }
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
  const { ballots, judgeQueues, projects, categories, criteria } = canonicalState;

  const judge_ballot_history =
    ballots
      .keySeq()
      .groupBy(ballot_id => ballots.get(ballot_id).user_id)
      .map(judge_ballots => judge_ballots
        .groupBy(judge_ballot_id => ballots.get(judge_ballot_id).project_id));

  const project_ballots =
    ballots
      .keySeq()
      .groupBy(ballot_id => ballots.get(ballot_id).project_id)
      .map(project_ballots => project_ballots
        .groupBy(project_ballot_id => ballots.get(project_ballot_id).user_id));

  const project_queues = projects.map(_ => Immutable.Set())
    .merge(judgeQueues.groupBy(m => m.get('queuedProjectID')).map(m => m.keySeq().toSet()));
  const project_assignments = projects.map(_ => Immutable.Set())
    .merge(judgeQueues.groupBy(m => m.get('activeProjectID')).map(m => m.keySeq().toSet()));

  const project_scores = projects.map(computeAllScoresForProject(project_ballots, categories, criteria, ballots));

  return new DerivedState({
    judge_ballot_history,
    project_ballots,
    project_queues,
    project_assignments,
    project_scores,
  });
};

const computeAllScoresForProject = (project_ballots, categories, criteria, ballots) => project => Immutable.Map().withMutations(map => {
  const judge_ballots = project_ballots.get(project.project_id) || Immutable.Map();

  // console.log(judge_ballots.toJS());

  const categoryScoresMap = {};

  judge_ballots.forEach((ballots_for_this_judge, judge_id) => {
    const categoryScoresForThisJudge = {};
    ballots_for_this_judge.forEach(id => {
      const ballot = ballots.get(id);
      const { criteria_id, score } = ballot;
      const { category_id } = criteria.get(criteria_id);
      if (!(category_id in categoryScoresForThisJudge)) {
        categoryScoresForThisJudge[category_id] = 0;
      }
      categoryScoresForThisJudge[category_id] += score;
    });
    for (const category_id in categoryScoresForThisJudge) {
      if (!(category_id in categoryScoresMap)) {
        categoryScoresMap[category_id] = [];
      }
      categoryScoresMap[category_id].push(categoryScoresForThisJudge[category_id]);
    }
  });

  for (const category_id in categoryScoresMap) {
    const scores = categoryScoresMap[category_id];
    map.set(category_id, Immutable.List([ mean(scores), sstdev(scores) ]));
  }
  return map;
});

const mean = arr => arr.reduce((a, b) => a + b) / arr.length;
const sstdev = arr => {
  if (arr.length < 2) {
    return 0;
  }
  const m = mean(arr);
  return Math.pow(arr.map(a => (a - m) * (a - m)).reduce((a, b) => a + b) / (arr.length - 1), 0.5);
};

const computeProjectHealth = derivedState => project => {
  let health = 1;

  const epsilon = 0.00000001 * ((project.project_id * 179426447) % 500);

  // hacky pseudorandom based on id so they don't get auto-assigned in order
  health += epsilon;

  if (derivedState.project_ballots.has(project.project_id)) {
    health += derivedState.project_ballots.get(project.project_id).size;
  }

  health += 0.75 * derivedState.project_assignments.get(project.project_id).size;
  health += 0.50 * derivedState.project_queues.get(project.project_id).size;

  return health;
};

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
      return state.withMutations(state => {
        const oldProjectID = state.canonical.judgeQueues.get(action.userID).get('queuedProjectID');

        state.setIn([
          'canonical',
          'judgeQueues',
          action.userID,
          'queuedProjectID',
        ], action.projectID);
        state.updateIn([
          'derived',
          'project_queues',
          action.projectID,
        ], s => s.add(action.userID));

        if (oldProjectID) {
          state.updateIn([
            'derived',
            'project_queues',
            oldProjectID,
          ], s => s.delete(action.userID));
        }
      });
    },
    'REMOVE_PROJECT_FROM_QUEUE': (state, action) => {
      return state
        .setIn([
          'canonical',
          'judgeQueues',
          action.userID,
          'queuedProjectID',
        ], null)
        .updateIn([
          'derived',
          'project_queues',
          action.projectID,
        ], s => s.delete(action.userID));
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
        state.updateIn([
          'derived',
          'project_queues',
          action.projectID,
        ], s => s.delete(action.userID));
        state.updateIn([
          'derived',
          'project_assignments',
          action.projectID,
        ], s => s.add(action.userID));
      });
    },
    'SKIP_PROJECT': (state, action) => {
      return state
        .setIn([
          'canonical',
          'judgeQueues',
          action.userID,
          'activeProjectID',
        ], null)
        .updateIn([
          'derived',
          'project_assignments',
          action.projectID,
        ], s => s.delete(action.userID));
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

        if (
          !state.derived.project_ballots.has(action.projectID)
          || !state.derived.project_ballots.get(action.projectID).has(action.userID)
        ) {
          state.setIn([
            'derived',
            'project_ballots',
            action.projectID,
            action.userID,
          ], Immutable.List());
        }
        state.updateIn([
          'derived',
          'project_ballots',
          action.projectID,
          action.userID,
        ], list => list.concat(action.ballots.map(b => b.ballot_id)));

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
        state.updateIn([
          'derived',
          'project_assignments',
          action.projectID,
        ], s => s.delete(action.userID));

        state.setIn([
          'derived',
          'project_scores',
          action.projectID,
        ], computeAllScoresForProject(
          state.derived.project_ballots,
          state.canonical.categories,
          state.canonical.criteria,
          state.canonical.ballots,
        )(state.canonical.projects.get(action.projectID)));
      });
      return s;
    },
    'PROJECT_SKIPPED': (state, action) => {
      const s = state.withMutations(state => {
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
        state.updateIn([
          'derived',
          'project_assignments',
          action.projectID,
        ], s => s.delete(action.userID));
      });
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
    'SET_EXPO': (state, action) => {
      return state.setIn([
        'program',
        'expo_number',
      ], action.expo);
    },
    'EXCLUDE_JUDGE': (state, action) => {
      return state.updateIn([
        'program',
        'excludedJudges',
      ], s => s.add(action.judge_id));
    },
    'UN_EXCLUDE_JUDGE': (state, action) => {
      return state.updateIn([
        'program',
        'excludedJudges',
      ], s => s.remove(action.judge_id));
    },
    'SELECT_JUDGE': (state, action) => {
      return state.setIn([
        'program',
        'leftPane',
      ], 'judgeInfo').setIn([
        'program',
        'selectedJudge',
      ], action.judge_id);
    },
    'SET_PANE': (state, action) => {
      return state.setIn([
        'program',
        'leftPane',
      ], action.pane);
    },

    'SET_SOCKET': (state, action) => {
      return state.setIn([
        'program',
        'socket',
      ], action.socket);
    },
  };

  if (action.type in handlers) {
    const newState = handlers[action.type](state, action);
    // ALWAYS recompute every project's health.
    // this should be based shallowly on derived state, so it's inexpensive.
    // we do this every time to make it easy to tweak project health without
    // worrying about which actions need to re-derive state.
    return newState.setIn(
      [
        'derived',
        'project_health',
      ],
      newState.canonical.projects.map(computeProjectHealth(newState.derived)),
    );
  } else {
    return state;
  }
};

export default rootReducer;
