import React, { Component } from 'react';
import Immutable from 'immutable';

import '../css/OverviewPane.css';

class OverviewPane extends Component {
  state = {
    // sort: 'health',
    sort: 1,
    sortDirection: 1,
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
                ({displayCategoryScore(project)}{this.props.counts.get(project.project_id)} / {this.props.health.get(project.project_id).toFixed(2)}) {project.table_number}: {project.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default OverviewPane;
