import React, { Component } from 'react';
import JudgeRowContainer from './containers/JudgeRowContainer.react';

import '../css/JudgeListing.css';

class JudgeListing extends Component {
  render() {
    return (
      <div className="JudgeListing">
        {this.props.judgeIDs.map((id, i) => <JudgeRowContainer judgeID={id} key={i} />)}
      </div>
    );
  }
}

export default JudgeListing;
