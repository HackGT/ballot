import { connect } from 'react-redux';
import ProjectListing from '../ProjectListing.react';

const mapStateToProps = state => {
  return {
    projects: state.canonical.projects.filter(project => project.expo_number === state.program.expo_number).valueSeq(),
  };
};

const ProjectListingContainer = connect(
  mapStateToProps,
)(ProjectListing);

export default ProjectListingContainer;
