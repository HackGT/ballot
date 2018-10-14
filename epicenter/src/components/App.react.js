import React, { Component } from 'react';
import SidePaneContainer from './containers/SidePaneContainer.react';
import JudgeListingContainer from './containers/JudgeListingContainer.react';
import ProjectListingContainer from './containers/ProjectListingContainer.react';

import '../css/App.css';

class App extends Component {
  render() {
    if (!this.props.loadedState) {
      return null;
    }

    return (
      <div className="App">
        <SidePaneContainer />
        <JudgeListingContainer />
        <ProjectListingContainer />
      </div>
    );
  }
}

export default App;
