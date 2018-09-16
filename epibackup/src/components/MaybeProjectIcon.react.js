import React, { Component } from 'react';
import '../css/MaybeProjectIcon.css';
import ProjectIconContainer from './containers/ProjectIconContainer.react';

class MaybeProjectIcon extends Component {
  render() {
    if (this.props.project) {
      return <ProjectIconContainer projectID={this.props.project.project_id} inList={false} />;
    } else {
      return <div className="emptyProjectIcon"></div>;
    }
  }  
}

export default MaybeProjectIcon;
