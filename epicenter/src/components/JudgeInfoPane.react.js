import React, { Component } from 'react';
import Immutable from 'immutable';

class JudgeInfoPane extends Component {
  render() {
    return (
      <div className="JudgeInfoPane">
        <h2>
          {this.props.name}
        </h2>
        {
          this.props.excluded
          ? <button onClick={() => this.props.unExcludeJudge(this.props.judge_id)}>Judge is excluded from auto-assign (click to include)</button>
          : <button onClick={() => this.props.excludeJudge(this.props.judge_id)}>Judge is included in auto-assign (click to exclude)</button>
        }
      </div>
    );
  }
}

export default JudgeInfoPane;
