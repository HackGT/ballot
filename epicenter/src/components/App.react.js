import React, { Component } from 'react';
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
        <JudgeListingContainer />
        <ProjectListingContainer />
      </div>
    );
  }
}

export default App;
