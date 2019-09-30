import Axios from 'axios';
import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { connect } from 'react-redux';

import Project, { ProjectState, TableGroupState } from '../../types/Project';
import { fetchProjects } from '../../state/Project';
import { CategoryState } from '../../types/Category';
import { fillCategories } from '../../state/Category';
import { AppState } from '../../state/Store';
import { fetchTableGroups } from '../../state/TableGroup';

const mapStateToProps = (state: AppState) => {
	return {
		categories: state.categories,
		projects: state.projects,
		tableGroups: state.tableGroups,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		fetchTableGroups: () => {
			dispatch(fetchTableGroups());
		},
		fetchProjects: () => {
			dispatch(fetchProjects());
		},
		fillCategories: (categories: CategoryState) => {
			dispatch(fillCategories(categories));
		},
	};
};

interface PageProjectsProps {
	categories: CategoryState;
	projects: ProjectState;
	tableGroups: TableGroupState;
	fillCategories: (categories: CategoryState) => void;
	fetchTableGroups: () => void;
	fetchProjects: () => void;
}

type State = {
	requesting: boolean;
}

type Action =
	| { type: 'request-start'}
	| { type: 'request-finish'};

const PageProjectsComponent: React.FC<PageProjectsProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'request-start':
				return { ...state, requesting: true };
			case 'request-finish':
				return { ...state, requesting: false };
			default:
				return state;
		}
	}, {
		requesting: false,
	}, undefined);

	React.useEffect(() => {
		const initialFetch = async () => {
			dispatch({ type: 'request-start' });
			await Promise.all([
				props.fetchTableGroups(),
				props.fetchProjects(),
				fetchCategories(),
			]);
			dispatch({ type: 'request-finish' });
		};

		initialFetch();
	}, []);

	const fetchCategories = async () => {
		const result = await Axios.get('/api/categories/allCategories');
		if (result.status) {
			const payload: CategoryState = result.data;
			props.fillCategories(payload);
		} else {
			// TODO error checking
		}
	};

	const getProjectCards = () => {
		if (
			Object.values(props.categories).length > 0
			&& Object.values(props.projects).length > 0
			&& Object.values(props.tableGroups).length > 0
		) {
			return Object.values(props.projects).map((project: Project) => {
				const categories = project.categoryIDs.map((categoryID: number) => {
					return (
						<Badge
							key={categoryID}
							variant='secondary'
							style={{ margin: '0 2px' }}>
							{props.categories[categoryID].name}
						</Badge>
					);
				});
				const tableGroup = props.tableGroups[project.tableGroupID];
				return (
					<a
						key={project.id!}
						href={project.devpostURL}
						target='_blank'
						style={{
							textDecoration: 'none',
							width: '18rem',
							margin: 6,
						}}>
					<Card style={{ height: '100%', }}>
						<Card.Body>
							<Card.Title style={{
								color: tableGroup.color
							}}>{project.name}</Card.Title>
							<Card.Subtitle className="mb-2 text-muted">Expo {project.expoNumber}, Table: {tableGroup.name} {project.tableNumber}</Card.Subtitle>
							<Card.Text>
								{categories}
							</Card.Text>
						</Card.Body>
					</Card>
					</a>
				);
			});
		}
	};

	return (
		<div style={{ margin: '12px' }}>
			<h1 style={{ textAlign: 'center' }}>Projects</h1>
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				maxWidth: 1300,
				margin: '12px auto 0',
			}}>
				{getProjectCards()}
			</div>
		</div>
	);
};

const PageProjects = connect(mapStateToProps, mapDispatchToProps)(PageProjectsComponent);

export default PageProjects;
