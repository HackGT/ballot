import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState } from '../../state/Store';
import { TableGroupState, ProjectState } from '../../types/Project';
import { fetchTableGroups } from '../../state/TableGroup';
import { fetchProjects } from '../../state/Project';

import PageAdminProjectsUploadModal from './PageAdminProjectsUploadModal';
import PageAdminProjectsManageTableGroupsModal from './PageAdminProjectsManageTableGroupsModal';
import PageAdminProjectsAddProjectModal from './PageAdminProjectsAddProjectModal';
import PageAdminProjectsEpicenter from './PageAdminProjectsEpicenter';
import { fetchUsers } from '../../state/User';
import { requestFinish, requestStart } from '../../state/Request';
import { UserState } from '../../types/User';
import { fetchBallots } from '../../state/Ballot';
import { CategoryCriteriaState } from '../../types/Category';
import Axios from "axios";

const mapStateToProps = (state: AppState) => {
	return {
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
		requestFinish: () => dispatch(requestFinish()),
		requestStart: () => dispatch(requestStart()),
	};
};

interface PageAdminProjectsProps {
	categories: CategoryCriteriaState;
	requesting: boolean;
	tableGroups: TableGroupState;
	projects: ProjectState;
	users: UserState;
	fetchBallots: () => void;
	fetchTableGroups: () => void;
	fetchProjects: () => void;
	fetchUsers: () => void;
	requestFinish: () => void;
	requestStart: () => void;
}

enum ModalType {
	UploadProjects,
	AddProject,
	ManageTableGroups,
	None,
}

type State = {
	modalOpen: ModalType,
}

type Action =
	| { type: 'modal-close' }
	| { type: 'modal-open', modal: ModalType };

const PageAdminProjectsComponent: React.FC<PageAdminProjectsProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'modal-close':
				return { ...state, modalOpen: ModalType.None }
			case 'modal-open':
				return { ...state, modalOpen: action.modal }
			default:
				return state;
		}
	}, {
		modalOpen: ModalType.None,
	}, undefined);
	const closeModal = () => dispatch({ type: 'modal-close' });

	React.useEffect(() => {
		const initialFetch = async () => {
			props.requestStart();
			await Promise.all([
				props.fetchBallots(),
				props.fetchTableGroups(),
				props.fetchProjects(),
				props.fetchUsers(),
			]);
			props.requestFinish();
		};

		if (!(Object.values(props.users).length > 0
			&& Object.values(props.projects).length > 0
			&& Object.values(props.tableGroups).length > 0)) {
			initialFetch();
		}
	}, []);

	const getInnerContent = () => {
		if (props.requesting) {
			return 'Loading';
		}

		if (Object.values(props.users).length === 0) {
			return 'Loading';
			// TODO add real spinner
		}

		return (
			<>
				<div style={{
					display: 'flex',
					justifyContent: 'center',
					flexWrap: 'wrap',
				}}>
					<ButtonGroup>
            <Button
              onClick={async () => {
                if (window.confirm('This operation will replace all existing projects and generated categories. Continue?')) {
                  const projects = await Axios.get('/api/submit/import/true/false');
                  if (projects.status) {
                    const data = projects.data;
                    console.log(data);
                    alert('Projects and categories imported!');
                    window.location.reload();
                  } else {
                    alert('Import error!');
                  }
								}
              }}
              size='sm'>
              Import Projects and Categories
            </Button>
            <Button
              onClick={async () => {
                if (window.confirm('This operation will replace all existing projects. Continue?')) {
                  const projects = await Axios.get('/api/submit/import/false/false');
                  if (projects.status) {
                    const data = projects.data;
                    console.log(data);
                    alert('Projects imported!');
                    window.location.reload();
                  } else {
                    alert('Import error!');
                  }
                }
              }}
              size='sm'>
              Import Projects
            </Button>
            <Button
              onClick={async () => {
                if (window.confirm('This operation will replace all existing projects and generated categories. Continue?')) {
                  const projects = await Axios.get('/api/submit/import/true/true');
                  if (projects.status) {
                    const data = projects.data;
                    console.log(data);
                    alert('Projects and categories imported!');
                    window.location.reload();
                  } else {
                    alert('Import error!');
                  }
                }
              }}
              size='sm'>
              Import Accepted Projects and Categories
            </Button>
            <Button
              onClick={async () => {
                if (window.confirm('This operation will replace all existing projects. Continue?')) {
                  const projects = await Axios.get('/api/submit/import/true/false');
                  if (projects.status) {
                    const data = projects.data;
                    console.log(data);
                    alert('Projects and categories imported!');
                    window.location.reload();
                  } else {
                    alert('Import error!');
                  }
                }
              }}
              size='sm'>
              Import Accepted Projects
            </Button>
            <Button
              onClick={async () => {
                if (window.confirm('This operation will accept projects in Submit. Continue?')) {
                  const projects = await Axios.get('/api/submit/accept');
                  if (projects.status) {
                    const data = projects.data;
                    console.log(data);
                    alert('Projects accepted!');
                  } else {
                    alert('Acceptance error!');
                  }
                }
              }}
              size='sm'>
              Accept Projects to Submit
            </Button>
						<Button
							onClick={() => dispatch({
								type: 'modal-open',
								modal: ModalType.UploadProjects,
							})}
							size='sm'>
							Upload Projects
						</Button>
						<Button
							onClick={() => dispatch({
								type: 'modal-open',
								modal: ModalType.ManageTableGroups,
							})}
							variant={
								Object.values(props.tableGroups).length > 0 || props.requesting
									? 'outline-primary'
									: 'danger'
							}
							size='sm'>
							Manage Table Groups
						</Button>
						<Button
							onClick={() => dispatch({
								type: 'modal-open',
								modal: ModalType.AddProject,
							})}
							variant='outline-primary'
							size='sm'>
							Add Project
						</Button>
					</ButtonGroup>
				</div>
				<div style={{
					margin: '12px auto 0',
				}}>
					{Object.values(props.projects).length !== 0
						&& Object.values(props.tableGroups).length !== 0
						&& Object.values(props.categories.criteria).length !== 0
						? <PageAdminProjectsEpicenter />
						: null}
				</div>
			</>
		)
	}

	return (
		<div style={{ margin: '12px' }}>
			<h1 style={{ textAlign: 'center' }}>Projects</h1>
			{getInnerContent()}
			<PageAdminProjectsUploadModal
				modalOpen={state.modalOpen === ModalType.UploadProjects}
				closeModal={closeModal} />
			<PageAdminProjectsManageTableGroupsModal
				modalOpen={state.modalOpen === ModalType.ManageTableGroups}
				closeModal={closeModal} />
			<PageAdminProjectsAddProjectModal
				modalOpen={state.modalOpen === ModalType.AddProject}
				closeModal={closeModal} />
		</div>
	);
};

const PageAdminProjects = connect(
	mapStateToProps,
	mapDispatchToProps
)(PageAdminProjectsComponent);

export default PageAdminProjects;
