import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import { fillProjects } from '../../state/Project';
import { ProjectState } from '../../types/Project';

const mapDispatchToProps = (dispatch: any) => {
	return {
		fillProjects: (projects: ProjectState) => {
			dispatch(fillProjects(projects));
		},
	};
};

interface PageAdminProjectsAddProjectModalProps {
  modalOpen: boolean;
  closeModal: () => void;
	fillProjects: (projects: ProjectState) => void;
}

type State = {
  requesting: boolean;
}

type Action =
	| { type: 'request-start'}
  | { type: 'request-finish'};

const PageAdminProjectsAddProjectModalComponent: React.FC<PageAdminProjectsAddProjectModalProps> = (props) => {
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

  const handleSaveChanges = async () => {
    dispatch({ type: 'request-start' });
    // const result = await Axios.post('/api/categories/update', {
    // });
    // if (result.status) {
    //   const data = result.data;
    //   props.closeModal();
    //   dispatch({ type: 'request-finish' });
    // } else {
    //   // TODO add error checking.
    // }
  };

  const getForm = () => {
    return (
      <Form>
        <Form.Group>
          <Form.Label>Devpost CSV</Form.Label>
          <Form.Control
            disabled={state.requesting}
            type='file' />
          <Form.Text className="text-muted">
            Please download the CSV containing all projects from Devpost and upload it here.
          </Form.Text>
        </Form.Group>
      </Form>
    );
  };

	return (
		<Modal show={props.modalOpen} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getForm()}
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

const PageAdminProjectsAddProjectModal = connect(null, mapDispatchToProps)(PageAdminProjectsAddProjectModalComponent);

export default PageAdminProjectsAddProjectModal;

