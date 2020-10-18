import React from 'react';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState } from '../../state/Store';
import Project, { TableGroupState, ProjectState } from '../../types/Project';
import { fetchTableGroups } from '../../state/TableGroup';
import { fetchProjects } from '../../state/Project';

import { fetchUsers } from '../../state/User';
import { requestFinish, requestStart } from '../../state/Request';
import { UserState } from '../../types/User';
import { fetchBallots } from '../../state/Ballot';
import { CategoryCriteriaState } from '../../types/Category';
import Ballot, { BallotState } from "../../types/Ballot";
import { fetchCategories } from "../../state/Category";
import { fetchCompanies } from "../../state/Company";

const mapStateToProps = (state: AppState) => {
	return {
		ballots: state.ballots,
		categories: state.categories,
		requesting: state.requesting,
		tableGroups: state.tableGroups,
		projects: state.projects,
		users: state.users,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		fetchBallots: () => dispatch(fetchBallots()),
		fetchTableGroups: () => dispatch(fetchTableGroups()),
		fetchProjects: () => dispatch(fetchProjects()),
		fetchUsers: () => dispatch(fetchUsers()),
		fetchCategories: () => dispatch(fetchCategories()),
		fetchCompanies: () => dispatch(fetchCompanies()),
		requestFinish: () => dispatch(requestFinish()),
		requestStart: () => dispatch(requestStart()),
	};
};

interface PageAdminDashboardProps {
	ballots: BallotState;
	categories: CategoryCriteriaState;
	requesting: boolean;
	tableGroups: TableGroupState;
	projects: ProjectState;
	users: UserState;
	fetchBallots: () => void;
	fetchTableGroups: () => void;
	fetchProjects: () => void;
	fetchUsers: () => void;
	fetchCategories: () => void;
	fetchCompanies: () => void;
	requestFinish: () => void;
	requestStart: () => void;
}

const PageAdminDashboardComponent: React.FC<PageAdminDashboardProps> = (props) => {
	React.useEffect(() => {
		const initialFetch = async () => {
			props.requestStart();
			await Promise.all([
				props.fetchBallots(),
				props.fetchTableGroups(),
				props.fetchProjects(),
				props.fetchUsers(),
				props.fetchCompanies(),
				props.fetchCategories()
			]);
			props.requestFinish();
		};

		if (!(Object.values(props.users).length > 0
			&& Object.values(props.projects).length > 0
			&& Object.values(props.tableGroups).length > 0)) {
			initialFetch();
		}
	}, []);

	if (props.requesting) {
		return <h1>Loading</h1>;
	}

	console.log(props);

	return (
		<div style={{ margin: '12px' }}>
			<h1 style={{ textAlign: 'center' }}>Dashboard</h1>
			{Object.values(props.projects).map((project: Project) => {
				return (
					<div>
						<h3>{project.id} - {project.name}</h3>
						{project.categoryIDs.map((categoryID: number) => {
							if (!props.categories.categories[categoryID]) {
								return <h5>Category ID: {categoryID}</h5>
							}

							if (!props.ballots.dProjectScores[project.id!]) {
								return <h5>{props.categories.categories[categoryID].name}</h5>;
							}

							const criteriaIDs: number[] = Object.values(props.categories.categories[categoryID].criteria).map((criteria) => criteria.id);
							const criteriaNames: string[] = Object.values(props.categories.categories[categoryID].criteria).map((criteria) => criteria.name);

							return (
								<>
									<h5>{props.categories.categories[categoryID].name}</h5>
									<Table striped bordered hover size="sm">
										<thead>
											<tr>
												<th>Judge</th>
												{criteriaNames.map((name) => <th>{name}</th>)}
												<th>Total</th>
											</tr>
										</thead>
										<tbody>
											{Object.values(props.ballots.dProjectScores[project.id!]).map((ballots: Ballot[]) => {
												let scores: number[] = [];

												for (let criteriaID of criteriaIDs) {
													let foundBallot = ballots.find(ballot => ballot.criteriaID == criteriaID);

													if (foundBallot) {
														scores.push(foundBallot.score);
													}
												}

												if (scores.length == criteriaIDs.length) {
													return (
														<tr>
															<td>{props.users[ballots[0].userID].name}</td>
															{scores.map(score => <td>{score}</td>)}
															<td>{scores.reduce((a, b) => a + b, 0)}</td>
														</tr>
													);
												} else {
													return null;
												}
											})}
										</tbody>
									</Table>
								</>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};


const PageAdminDashboard = connect(
	mapStateToProps,
	mapDispatchToProps
)(PageAdminDashboardComponent);

export default PageAdminDashboard;
