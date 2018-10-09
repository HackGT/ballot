import React, { Component } from 'react';
import '../css/ProjectListing.css';
import ProjectIconContainer from './containers/ProjectIconContainer.react';

class ProjectListing extends Component {
  state = {
    icons: true,
  };

  render() {
    return (
      <div className="ProjectListing">
        <button onClick={() => this.setState(prevState => ({ icons: !prevState.icons }))}>swap</button>
        {
          this.state.icons
          ? (
            <div className="projectIcons">
              {this.props.projects.map((project, i) => (
                <ProjectIconContainer
                  projectID={project.project_id}
                  inList={true}
                  key={i} />
              ))}
            </div>
          )
          : (
            <div className="projectTextList">
              {this.props.projects.map((project, i) => {
                return (
                  <div key={i}>
                    ({this.props.counts.get(project.project_id)} / {this.props.health.get(project.project_id).toFixed(2)}) {project.table_number}: {project.name}
                  </div>
                );
              })}
            </div>
          )
        }
      </div>
    );
  }
}

export default ProjectListing;
