import Axios from 'axios';
import React from 'react';
import { Badge, Card, DropdownButton, Dropdown, Button, Modal, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import Project, { ProjectState, TableGroupState } from '../../types/Project';
import { fetchProjects } from '../../state/Project';
import Category, { CategoryState, CategoryCriteriaState } from '../../types/Category';
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
	categories: CategoryCriteriaState;
	projects: ProjectState;
	tableGroups: TableGroupState;
	fillCategories: (categories: CategoryState) => void;
	fetchTableGroups: () => void;
	fetchProjects: () => void;
}

type State = {
	requesting: boolean;
	filterBy: number;
	modalOpen: boolean;
}

type Action =
	| { type: 'change-filterBy', categoryID: number }
	| { type: 'toggle-modal' }
	| { type: 'request-start'}
	| { type: 'request-finish'};

const PageProjectsComponent: React.FC<PageProjectsProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'toggle-modal':
				return { ...state, modalOpen: !state.modalOpen };
			case 'change-filterBy':
				return { ...state, filterBy: action.categoryID };
			case 'request-start':
				return { ...state, requesting: true };
			case 'request-finish':
				return { ...state, requesting: false };
			default:
				return state;
		}
	}, {
		requesting: false,
		filterBy: 0,
		modalOpen: false,
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
			Object.values(props.categories.categories).length > 0
			&& Object.values(props.projects).length > 0
			&& Object.values(props.tableGroups).length > 0
		) {
			return Object.values(props.projects)
				.filter((project: Project) => !state.filterBy || project.categoryIDs.includes(state.filterBy))
				.map((project: Project) => {
				const categories = project.categoryIDs.map((categoryID: number) => {
					return (
						<Badge
							key={categoryID}
							variant='secondary'
							style={{ margin: '0 2px' }}>
							{props.categories.categories[categoryID].name}
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

	const getCategoriesRadios = () => {
		return Object.values(props.categories.categories).map((category: Category) => {
			return (
				<Form.Check
				checked={state.filterBy === category.id!}
					key={category.id!}
					type='radio'
					name='prizeName'
					label={category.name}
					onChange={() => dispatch({ type: 'change-filterBy', categoryID: category.id! })}
					/>
			);
		});
	};

	return (
		<>
			<div style={{ margin: '12px' }}>
				<h1 style={{ textAlign: 'center' }}>Projects</h1>
				<div style={{ textAlign: 'center' }}>
					<Button onClick={() => dispatch({ type: 'toggle-modal' })}>Filter Projects</Button>
				</div>
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
			<Modal show={state.modalOpen} onHide={() => dispatch({ type: 'toggle-modal'})}>
				<Modal.Header closeButton>
					Filter Projects
				</Modal.Header>
				<Modal.Body>
					<Form.Group>
						<Form.Check
							checked={state.filterBy === 0}
							name='prizeName'
							type='radio'
							label={'All Projects'}
							onChange={() => dispatch({ type: 'change-filterBy', categoryID: 0 })}
							/>
						{getCategoriesRadios()}

					</Form.Group>
				</Modal.Body>
			</Modal>
		</>
	);
};

const PageProjects = connect(mapStateToProps, mapDispatchToProps)(PageProjectsComponent);

export default PageProjects;
