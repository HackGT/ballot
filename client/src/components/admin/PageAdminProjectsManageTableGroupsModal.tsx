import Axios from 'axios';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import { fillProjects } from '../../state/Project';
import { ProjectState, TableGroupState, TableGroup, EMPTY_TABLE_GROUP } from '../../types/Project';
import { AppState } from '../../state/Store';

import PageAdminProjectsManageTableGroupsModalGroupRow from './PageAdminProjectsManageTableGroupsModalGroupRow';
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

interface PageAdminProjectsManageTableGroupsModalProps {
  modalOpen: boolean;
  tableGroups: TableGroupState;
  closeModal: () => void;
	fillTableGroups: (tableGroups: TableGroupState) => void;
}

type State = {
  currentNewID: number;
  tableGroups: TableGroupState;
  requesting: boolean;
}

type Action =
  | { type: 'increase-new-id' }
  | { type: 'update-table-group', tableGroups: TableGroupState }
	| { type: 'request-start'}
  | { type: 'request-finish'};

const PageAdminProjectsManageTableGroupsModalComponent: React.FC<PageAdminProjectsManageTableGroupsModalProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
      case 'increase-new-id':
        return { ...state, currentNewID: state.currentNewID - 1 }
      case 'update-table-group':
        return { ...state, tableGroups: action.tableGroups };
			case 'request-start':
				return { ...state, requesting: true };
			case 'request-finish':
        return { ...state, requesting: false };
			default:
				return state;
		}
	}, {
    currentNewID: -1,
    tableGroups: {},
    requesting: false,
  }, undefined);

  const tableGroupsEffect = props.tableGroups;

  React.useEffect(() => {
    dispatch({ type: 'update-table-group', tableGroups: props.tableGroups });
  }, [tableGroupsEffect]);

  const handleSaveChanges = async () => {
    dispatch({ type: 'request-start' });
    const result = await Axios.post('/api/tableGroups/update', {
      tableGroups: Object.values(state.tableGroups),
    });
    if (result.status) {
      const data = result.data;
      props.fillTableGroups(data);
      props.closeModal();
      dispatch({ type: 'request-finish' });
    } else {
      // TODO add error checking.
    }
  };

  const getForm = () => {
    const updateTableGroup = (tableGroup: TableGroup) => {
      dispatch({
        type: 'update-table-group',
        tableGroups: {
          ...state.tableGroups,
          [tableGroup.id!]: tableGroup,
        },
      });
    };
    const deleteTableGroup = (tableGroupID: number) => {
      let {[tableGroupID]: omit, ...rest} = state.tableGroups;
      dispatch({
        type: 'update-table-group',
        tableGroups: rest,
      });
    };

    if (Object.values(state.tableGroups).length > 0) {
      return Object.values(state.tableGroups).map((tableGroup: TableGroup) => {
        return <PageAdminProjectsManageTableGroupsModalGroupRow
          key={tableGroup.id}
          tableGroup={tableGroup}
          requesting={state.requesting}
          updateTableGroup={updateTableGroup}
          deleteTableGroup={deleteTableGroup} />
      });
    }
    return <div>No Table Groups</div>;
  };

  const handleNewTableGroup = () => {
    const newGroup = {
      ...EMPTY_TABLE_GROUP,
      id: state.currentNewID,
    };
    dispatch({ type: 'increase-new-id' });
    dispatch({
      type: 'update-table-group',
      tableGroups: {
        ...state.tableGroups,
        [newGroup.id]: newGroup,
      }
    });
  };

	return (
		<Modal show={props.modalOpen} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Table Groups</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Table groups are how your expo will be organized. Table groups can be a color, some fancy name, or a room number. You must have at least one table group in order to upload projects. </p>
        <Form>
          {getForm()}
        </Form>
        <Button
          disabled={state.requesting}
          variant='outline-primary'
          onClick={handleNewTableGroup}>
          New Table Group
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={state.requesting}
          onClick={props.closeModal}
          variant="secondary">
          Close
        </Button>
        <Button
          disabled={state.requesting}
          onClick={handleSaveChanges}
          variant="primary">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
	);
};

const PageAdminProjectsManageTableGroupsModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageAdminProjectsManageTableGroupsModalComponent);

export default PageAdminProjectsManageTableGroupsModal;

