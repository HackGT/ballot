import { connect } from 'react-redux';
import ProjectIcon from '../ProjectIcon.react';

const mapStateToProps = (state, ownProps) => {
  return {
    selected: state.program.selectedProjectID === ownProps.projectID,
    inList: ownProps.inList,
    project: state.canonical.projects.get(ownProps.projectID),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onMount: ref => {
      dispatch({
        type: 'SET_PROJECT_ICON_REF',
        ref,
        projectID: ownProps.projectID,
      });
    },
    setActiveProject: () => {
      dispatch({
        type: 'SET_SELECTED_PROJECT',
        projectID: ownProps.projectID,
      });
    },
  };
};

const ProjectIconContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectIcon);

export default ProjectIconContainer;