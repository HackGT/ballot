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
    categories: state.canonical.categories,
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
  };
};

const OverviewPaneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewPane);

export default OverviewPaneContainer;
