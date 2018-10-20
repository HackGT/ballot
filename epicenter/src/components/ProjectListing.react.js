import React, { Component } from 'react';
import '../css/ProjectListing.css';
import ProjectIconContainer from './containers/ProjectIconContainer.react';

class ProjectListing extends Component {
  render() {
    return (
      <div className="ProjectListing">
        <div className="projectIcons">
          {this.props.projects.map((project, i) => (
            <ProjectIconContainer
              projectID={project.project_id}
              inList={true}
              key={project.project_id} />
          ))}
        </div>
      </div>
    );
  }
}

export default ProjectListing;
