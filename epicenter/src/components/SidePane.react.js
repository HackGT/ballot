import React, { Component } from 'react';
import OverviewPaneContainer from './containers/OverviewPaneContainer.react';
import JudgeInfoPaneContainer from './containers/JudgeInfoPaneContainer.react';

import '../css/SidePane.css';

class SidePane extends Component {
  render() {
    return (
      <div className="SidePane">
        {
          this.props.pane !== 'overview'
            ? (
              <div>
                <button onClick={() => this.props.setPane('overview')}>To overview</button>
              </div>
            )
            : null
        }
        {this._renderPane()}
      </div>
    );
  }

  _renderPane() {
    switch (this.props.pane) {
      case 'overview':
        return <OverviewPaneContainer />;
      case 'judgeInfo':
        return <JudgeInfoPaneContainer />;
      case 'projectInfo':
        return this._renderProjectInfo();
    }
    return null;
  }

  _renderProjectInfo() {
    return <div className="ProjectInfoPane" />;
  }
}

export default SidePane;
