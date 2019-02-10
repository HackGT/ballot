import React, { Component } from 'react';
import Immutable from 'immutable';

import '../css/OverviewPane.css';

class OverviewPane extends Component {
  state = {
    sort: 'health',
    sortDirection: -1,
  };

  render() {
    let sortedProjects = this.props.projects;
    let displayCategoryScore = project => '';
    let displaySort = '';
    if (this.state.sort === 'health') {
      sortedProjects = sortedProjects.sortBy(project => this.state.sortDirection * this.props.health.get(project.project_id));
      displaySort = 'project health';
    } else if (this.state.sort === 'count') {
      sortedProjects = sortedProjects.sortBy(project => this.state.sortDirection * this.props.counts.get(project.project_id));
      displaySort = 'number of times judged';
    } else {
      // sort by category score
      sortedProjects = sortedProjects.sortBy(project => this.state.sortDirection * (this.props.project_scores.get(project.project_id).get('' + this.state.sort) || Immutable.List([0, 0])).get(0));
      displaySort = this.props.categories.get(this.state.sort).name;
      displayCategoryScore = project => (this.props.project_scores.get(project.project_id).get('' + this.state.sort) || Immutable.List([0, 0])).get(0).toFixed(2) + ' / ';
    }

    return (
      <div className="OverviewPane">
        <p>
          Expo <input type="number" value={this.props.expo} onChange={event => this.props.setExpo(parseInt(event.target.value, 10))} />
        </p>
        <p>
          Goodness power (default 0.5): <input type="number" step="0.01" value={this.props.goodnessPower} onChange={event => this.props.setGoodnessPower(event.target.value)} /><br />
          Good projects with >= 2 judges have lower health. Multiplier is taken to the (times judged * goodness power) power. 0 to disable.
        </p>
        <p>
          Variance power (default 1): <input type="number" step="0.01" value={this.props.stdevPower} onChange={event => this.props.setStdevPower(event.target.value)} /><br />
          Higher-variance projects with >= 2 judges have lower health. (5 / (5 + sstdev)) to the variancePower. 0 to disable.
        </p>
        <p>
          Skip power (default 1): <input type="number" step="0.01" value={this.props.skipPower} onChange={event => this.props.setSkipPower(event.target.value)} /><br />
          Twice-skipped projects have lower health. Multiplier is (# skipped) to the skipPower. 0 to disable.
        </p>
        <p>
          Sorting by: {displaySort}
        </p>
        <button onClick={() => this.setState(prevState => ({ sortDirection: -1 * prevState.sortDirection }))}>Swap sort direction</button><br />
        <button onClick={() => this.setState({ sort: 'health' })}>Sort by health</button><br />
        <button onClick={() => this.setState({ sort: 'count' })}>Sort by count</button><br />
        {this.props.categories.map(category => (
          <div>
            <button onClick={() => this.setState({ sort: category.category_id })}>Sort by {category.name}</button><br />
          </div>
        )).valueSeq()}
        <div className="projectTextList">
          {sortedProjects.map((project, i) => {
            return (
              <div key={i} onClick={() => this.props.setSelectedProject(project)}>
                ({displayCategoryScore(project)}{this.props.counts.get(project.project_id)}, {this.props.project_skipped_count.get(project.project_id)}s, {this.props.project_queues.has(project.project_id) ? this.props.project_queues.get(project.project_id).size : 0}q, {this.props.project_assignments.has(project.project_id) ? this.props.project_assignments.get(project.project_id).size : 0}a / {this.props.health.get(project.project_id).toFixed(2)}) {project.table_number}: {project.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default OverviewPane;
