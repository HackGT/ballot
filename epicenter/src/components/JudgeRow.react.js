import React, { Component } from 'react';
import '../css/JudgeRow.css';
import MaybeProjectIcon from './MaybeProjectIcon.react';
import ProjectIconContainer from './containers/ProjectIconContainer.react';

class JudgeRow extends Component {
  render() {
    return (
      <div className="JudgeRow">
        <div className="judgeHistory">{this.props.scored.takeLast(10).map(project => <ProjectIconContainer projectID={project.project_id} inList={false}/>)}</div>
        <div className="judgeName">{this.props.name}</div>
        <div className="activeProject" ref="activeIcon"><MaybeProjectIcon project={this.props.activeProject} /></div>
        <div
          className="queuedProject"
          ref="queueIcon"
          onClick={this.props.enqueueSelectedProject}>
          <MaybeProjectIcon project={this.props.queuedProject} />
        </div>
      </div>
    );
  }

  componentDidMount () {
    this.props.setActiveIconRef(this.refs.activeIcon);
    this.props.setQueueIconRef(this.refs.queueIcon);
  }
}

export default JudgeRow;
