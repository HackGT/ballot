import Immutable from 'immutable';

const State = Immutable.Record({});

const rootReducer = (state = new State(), action) => {
  const handlers = {};

  if (action.type in handlers) {
    return handlers[action.type](state, action);
  } else {
    return state;
  }
};

export default rootReducer;