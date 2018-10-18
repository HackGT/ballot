import { connect } from 'react-redux';
import JudgeInfoPane from '../JudgeInfoPane.react';

const mapStateToProps = state => {
  return {
    judge_id: state.program.selectedJudge,
    name: state.canonical.users.get(state.program.selectedJudge).name,
    excluded: state.program.excludedJudges.has(state.program.selectedJudge),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    excludeJudge: judge_id => {
      dispatch({
        type: 'EXCLUDE_JUDGE',
        judge_id,
      });
    },
    unExcludeJudge: judge_id => {
      dispatch({
        type: 'UN_EXCLUDE_JUDGE',
        judge_id,
      });
    },
  };
};

const JudgeInfoPaneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(JudgeInfoPane);

export default JudgeInfoPaneContainer;
