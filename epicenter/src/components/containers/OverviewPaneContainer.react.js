import { connect } from 'react-redux';
import OverviewPane from '../OverviewPane.react';

const mapStateToProps = state => {
  return {
    projects: state.canonical.projects.filter(project => project.expo_number === state.program.expo_number).valueSeq(),
    health: state.derived.project_health,
    counts: state.canonical.projects.map((_, id) => state.derived.project_ballots.has(id)
              ? state.derived.project_ballots.get(id).size
              : 0
            ),
    project_scores: state.derived.project_scores,
    project_skipped_count: state.derived.project_skipped_count,
    categories: state.canonical.categories,
    expo: state.program.expo_number,
    goodnessPower: state.program.goodnessPower,
    stdevPower: state.program.stdevPower,
    skipPower: state.program.skipPower,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSelectedProject: project => {
      dispatch({
        type: 'SET_SELECTED_PROJECT',
        projectID: project.project_id,
      });
    },
    setExpo: expo => {
      dispatch({
        type: 'SET_EXPO',
        expo,
      });
    },
    setGoodnessPower: goodnessPower => {
      const parsed = parseFloat(goodnessPower);
      dispatch({
        type: 'SET_GOODNESS_POWER',
        goodnessPower: isNaN(parsed) ? 0 : parsed,
      });
    },
    setStdevPower: stdevPower => {
      const parsed = parseFloat(stdevPower);
      dispatch({
        type: 'SET_STDEV_POWER',
        stdevPower: isNaN(parsed) ? 0 : parsed,
      });
    },
    setSkipPower: skipPower => {
      const parsed = parseFloat(skipPower);
      dispatch({
        type: 'SET_SKIP_POWER',
        skipPower: isNaN(parsed) ? 0 : parsed,
      });
    },
  };
};

const OverviewPaneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewPane);

export default OverviewPaneContainer;
