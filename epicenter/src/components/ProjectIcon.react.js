import React, { Component } from 'react';
import '../css/ProjectIcon.css';

class ProjectIcon extends Component {
  render() {
    return (
      <div
        className={'ProjectIcon ' + this._className()}
        ref="icon"
        title={this.props.health}
        onClick={this._setActiveProject}>
        <div className="projectIconContents">
          <div title={this.props.project.name}>{this._renderTableNumber()}</div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.onMount && this.props.inList) {
      this.props.onMount(this.refs.icon);
    }
  }

  _getTableNumberSections() {
    return this.props.project.table_number.split(' ');
  }

  _renderTableNumber() {
    const [ section, number ] = this._getTableNumberSections();
    return section[0] + number;
  }

  _className() {
    const [ section, _ ] = this._getTableNumberSections();
    return section.toLowerCase() + (
      (this.props.inList && this.props.selected)
        ? ' pendingMove'
        : ''
    );
  }

  _setActiveProject = () => {
    if (!this.props.inList) {
      return;
    }
    this.props.setActiveProject();
  };

}

export default ProjectIcon;
