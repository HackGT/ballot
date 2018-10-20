import React, { Component } from 'react';
import '../css/JudgeRow.css';
import MaybeProjectIcon from './MaybeProjectIcon.react';
import ProjectIconContainer from './containers/ProjectIconContainer.react';

class JudgeRow extends Component {
  render() {
    return (
      <div className="JudgeRow">
        <div className="judgeHistory">
          {
            this.props.scored.takeLast(5).map(
              (project, i, array) =>
                  <ProjectIconContainer
                    projectID={project.project_id}
                    inList={false} />
            ).toJS().map(
              (el, i, arr) => <span className={'history-opacity-' + (arr.length - i)}>{el}</span>
            )
          }
        </div>
        <div className={'judgeName' + (this.props.excluded ? ' excluded' : '')} onClick={this.props.selectJudge}>{this.props.name}</div>
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
