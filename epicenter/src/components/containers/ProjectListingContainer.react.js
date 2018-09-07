import { connect } from 'react-redux';
import ProjectListing from '../ProjectListing.react';

const mapStateToProps = state => {
  return {
    projects: state.canonical.projects.filter(project => project.expo_number === state.program.expo_number).valueSeq(),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setProjectIconRef: (ref, projectID) => {
      dispatch({
        type: 'SET_PROJECT_ICON_REF',
        ref,
        projectID,
      });
    },
  };
};

const ProjectListingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectListing);

export default ProjectListingContainer;