import Axios from 'axios';
import React from 'react';
import { Badge, Card, Button, Modal, Form } from 'react-bootstrap';
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
	searchText: string;
}

type Action =
	| { type: 'change-filterBy', categoryID: number }
	| { type: 'toggle-modal' }
	| { type: 'request-start'}
	| { type: 'request-finish'}
	| { type: 'change-search', search: string };

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
			case 'change-search':
				return { ...state, searchText: action.search };
			default:
				return state;
		}
	}, {
		requesting: false,
		filterBy: 0,
		modalOpen: false,
		searchText: '',
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
				.filter((project: Project) => project.name.toLowerCase().includes(state.searchText.toLowerCase()))
				.map((project: Project) => {
				const categories = project.categoryIDs.filter((categoryID: number) => {
					if (props.categories.categories[categoryID] == null) {
						return false;
					}
					if (props.categories.categories[categoryID].isHidden) {
						return false;
					}
					return true;
				}).map((categoryID: number) => {
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
		return Object.values(props.categories.categories).filter((category: Category) => {
			if (category.isHidden) {
				return false;
			}
			return true;
		}).map((category: Category) => {
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
			<div style={{ width: '100%' }}>
				<div style={{
					margin: '0 auto',
					maxWidth: 1300,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexWrap: 'wrap', }}>
					<h1>Projects</h1>
					<div style={{ flexGrow: 2 }}></div>
					<Button
						style={{ width: 130 }}
						variant='outline-dark'
						onClick={() => dispatch({ type: 'toggle-modal' })}>
						Categories
					</Button>
					<Form.Control
						style={{ maxWidth: 300, margin: '0 12px' }}
						value={state.searchText}
						onChange={(event: any) => dispatch({ type: 'change-search', search: event.target.value})}
						type='text'
						placeholder='Search for projects' />
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
