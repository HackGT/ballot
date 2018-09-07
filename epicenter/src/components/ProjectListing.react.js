import React, { Component } from 'react';
import '../css/ProjectListing.css';
import ProjectIcon from './ProjectIcon.react';

class ProjectListing extends Component {
  render() {
    return (
      <div className="ProjectListing">
        <div className="projectIcons">
          {this.props.projects.map((project, i) => (
            <ProjectIcon
              project={project}
              key={i}
              onMount={ref => this.props.setProjectIconRef(ref, project.project_id)} />
          ))}
        </div>
      </div>
    );
  }
}

export default ProjectListing;
