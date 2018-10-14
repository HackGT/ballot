import React, { Component } from 'react';

import '../css/OverviewPane.css';

class OverviewPane extends Component {
  render() {
    return (
      <div className="OverviewPane">
        <div className="projectTextList">
          {this.props.projects.map((project, i) => {
            return (
              <div key={i}>
                ({this.props.counts.get(project.project_id)} / {this.props.health.get(project.project_id).toFixed(2)}) {project.table_number}: {project.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default OverviewPane;
