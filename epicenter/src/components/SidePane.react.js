import React, { Component } from 'react';
import OverviewPaneContainer from './containers/OverviewPaneContainer.react';

import '../css/SidePane.css';

class SidePane extends Component {
  render() {
    return (
      <div className="SidePane">{this._renderPane()}</div>
    );
  }

  _renderPane() {
    switch (this.props.pane) {
      case 'overview':
        return <OverviewPaneContainer />;
      case 'judgeInfo':
        return this._renderJudgeInfo();
      case 'projectInfo':
        return this._renderProjectInfo();
    }
    return null;
  }

  _renderJudgeInfo() {
    return <div className="JudgeInfoPane" />;
  }

  _renderProjectInfo() {
    return <div className="ProjectInfoPane" />;
  }
}

export default SidePane;
