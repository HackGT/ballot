import React from 'react';
import { Button, Modal, } from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState } from '../../state/Store';
import User from '../../types/User';
import { loginUser } from '../../state/Account';

import PageAdminProjectsUploadModal from './PageAdminProjectsUploadModal';
import PageAdminProjectsManageTableGroupsModal from './PageAdminProjectsManageTableGroupsModal';
import PageAdminProjectsAddProjectModal from './PageAdminProjectsAddProjectModal';
import { ButtonGroup } from 'react-bootstrap';
import Axios from 'axios';
import { TableGroupState } from '../../types/Project';
import { fillTableGroups } from '../../state/TableGroup';

const mapStateToProps = (state: AppState) => {
	return {
		tableGroups: state.tableGroups,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		fillTableGroups: (tableGroups: TableGroupState) => {
			dispatch(fillTableGroups(tableGroups));
		},
	};
};

interface PageAdminProjectsProps {
	tableGroups: TableGroupState;
	fillTableGroups: (tableGroups: TableGroupState) => void;
}

enum ModalType {
	UploadProjects,
	AddProject,
	ManageTableGroups,
	None,
}

type State = {
	modalOpen: ModalType,
	requesting: boolean;
}

type Action =
	| { type: 'modal-close'}
	| { type: 'modal-open', modal: ModalType}
	| { type: 'request-start'}
	| { type: 'request-finish'};

const PageAdminProjectsComponent: React.FC<PageAdminProjectsProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'modal-close':
				return { ...state, modalOpen: ModalType.None }
			case 'modal-open':
				return { ...state, modalOpen: action.modal }
			case 'request-start':
				return { ...state, requesting: true };
			case 'request-finish':
				return { ...state, requesting: false };
			default:
				return state;
		}
	}, {
		modalOpen: ModalType.None,
		requesting: true,
	}, undefined);
	const closeModal = () => dispatch({ type: 'modal-close' });

	React.useEffect(() => {
		fetchTableGroups();
	}, []);

	const fetchTableGroups = async () => {
		dispatch({ type: 'request-start' });
		const result = await Axios.get('/api/tableGroups/allTableGroups');
		if (result.status) {
			const payload: TableGroupState = result.data;
			props.fillTableGroups(payload);
			dispatch({ type: 'request-finish' });
		} else {
			// TODO error checking
		}
	}

	return (
		<div style={{ margin: '12px' }}>
			<h1 style={{ textAlign: 'center' }}>Projects</h1>
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
			}}>
				<ButtonGroup>
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
							Object.values(props.tableGroups).length > 0 || state.requesting
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
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				maxWidth: 1300,
				margin: '12px auto 0',
			}}>
			</div>
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
