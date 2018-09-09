import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import JudgeRow from '../JudgeRow.react';

const mapStateToProps = (state, ownProps) => {
  const judge = state.canonical.users.get(ownProps.judgeID);
  return {
    name: judge.name,
    // TODO: necessary ternary?
    scored: state.canonical.judgedProjects.has(judge.user_id)
      ? state.canoical.judgedProjects.get(judge.user_id)
          .map(project_id => state.canonical.projects.get(project_id))
      : [],
    activeProject: state.canonical.judgeQueues.has(judge.user_id)
      ? state.canonical.projects.get(
          state.canonical.judgeQueues.get(judge.user_id).get('activeProjectID')
        )
      : null,
    queuedProject: state.canonical.judgeQueues.has(judge.user_id)
      ? state.canonical.projects.get(
          state.canonical.judgeQueues.get(judge.user_id).get('queuedProjectID')
        )
      : null,
    enqueueSelectedProject: () => {
      if (state.program.socket) {
        state.program.socket.emit('queue_project', {
          eventID: uuid(),
          userID: judge.user_id,
          projectID: state.program.selectedProjectID,
        });
      }
    },
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setActiveIconRef: ref => {
      dispatch({
        type: 'SET_ACTIVE_ICON_REF',
        judgeID: ownProps.judgeID,
        ref,
      });
    },
    setQueueIconRef: ref => {
      dispatch({
        type: 'SET_QUEUE_ICON_REF',
        judgeID: ownProps.judgeID,
        ref,
      });
    },
  };
};

const JudgeRowContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(JudgeRow);

export default JudgeRowContainer;