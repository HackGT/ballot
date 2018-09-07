import React, { Component } from 'react';
import '../css/MaybeProjectIcon.css';
import ProjectIcon from './ProjectIcon.react';

class MaybeProjectIcon extends Component {
  render() {
    if (this.props.project) {
      return <ProjectIcon project={this.props.project} />;
    } else {
      return <div className="emptyProjectIcon"></div>;
    }
  }  
}

export default MaybeProjectIcon;
