import { connect } from 'react-redux';
import ProjectListing from '../ProjectListing.react';

const mapStateToProps = state => {
  return {
    projects: state.canonical.projects.filter(project => project.expo_number === state.program.expo_number).valueSeq(),
    health: state.derived.project_health,
    counts: state.canonical.projects.map((_, id) => state.derived.project_ballots.has(id)
              ? state.derived.project_ballots.get(id).size
              : 0
    ),
  };
};

const ProjectListingContainer = connect(
  mapStateToProps,
)(ProjectListing);

export default ProjectListingContainer;