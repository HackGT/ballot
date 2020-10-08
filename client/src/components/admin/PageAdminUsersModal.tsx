import Axios from 'axios';
import React from 'react';
import { Form, ButtonToolbar, ToggleButtonGroup, ToggleButton, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState } from '../../state/Store';
import User, { UserRole, serverDataToClientUser, clientUserToServerUser } from '../../types/User';
import { updateUser } from '../../state/User';
import { requestFinish, requestStart } from '../../state/Request';
import { fetchCompanies } from '../../state/Company';

const mapStateToProps = (state: AppState) => {
	return {
    account: state.account,
    companies: state.companies,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		updateUser: (user: User) => {
			dispatch(updateUser(user));
    },
    requestFinish: () => {
      dispatch(requestFinish());
    },
    requestStart: () => {
      dispatch(requestStart());
    },
	};
};

interface PageAdminUsersModalProps {
  account: User;
  companies: string[];
  modalOpen: boolean;
  user: User;
  closeModal: () => void;
  updateUser: (user: User) => void;
  requestFinish: () => void;
  requestStart: () => void;
}

type State = {
  requesting: boolean;
  user: User;
}

type Action =
  | { type: 'update-user', user: User };

const PageAdminUsersModalComponent: React.FC<PageAdminUsersModalProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
      case 'update-user':
        return { ...state, user: action.user };
			default:
				return state;
		}
	}, {
    requesting: false,
    user: props.user,
  }, undefined);

  const user = props.user;

  React.useEffect(() => {
    dispatch({ type: 'update-user', user: props.user });
  }, [user]);

  const _handleSaveChanges = async () => {
    try {
      props.requestStart();
      const result = await Axios.post('/api/users/update', {
        user: clientUserToServerUser(state.user),
      });
      if (result.status) {
        const data = result.data;
        props.requestFinish();
        props.closeModal();
        props.updateUser(serverDataToClientUser(data));
      } else {
        // TODO add error checking.
      }
    } catch(error) {
      // TODO improve error handling.
      alert('Server error. Please try again.');
      window.location.reload();
    }
  };

  const _getCompanyList = () => {
    return props.companies.map((company: string) => {
      return (
        <option key={company}>{company}</option>
      );
    });
  };

  const _getForm = () => {
    return (
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            disabled={state.requesting}
            onChange={(event: any) => dispatch({
              type: 'update-user',
              user: {
                ...state.user,
                name: event.target.value,
              },
            })}
            value={state.user.name}
            type="text"
            placeholder="Name" />
        </Form.Group>
        <Form.Group>
        <Form.Label>Permission Level</Form.Label>
          <ButtonToolbar>
            <ToggleButtonGroup
              name='role'
              onChange={(value: any) => dispatch({
                type: 'update-user',
                user: {
                  ...state.user,
                  role: value,
                }
              })}
              type='radio'
              value={state.user.role} >
              <ToggleButton
                disabled={state.requesting}
                value={UserRole.Pending}>
                Pending
              </ToggleButton>
              <ToggleButton
                disabled={state.requesting}
                value={UserRole.Judge}>
                Judge
              </ToggleButton>
              <ToggleButton
                disabled={state.requesting}
                value={UserRole.Admin}>
                Admin
              </ToggleButton>
              <ToggleButton
                disabled={state.requesting}
                value={UserRole.Owner}>
                Owner
              </ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </Form.Group>
        <Form.Group>
          <Form.Label>Company/Group Name</Form.Label>
          <Form.Control
            as='select'
            disabled={state.requesting}
            onChange={(event: any) => dispatch({
              type: 'update-user',
              user: {
                ...state.user,
                company: event.target.value,
              },
            })}
            value={state.user.company}
            type="text"
            placeholder="Company">
            {_getCompanyList()}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Button variant='outline-danger'>Reset Password</Button>
        </Form.Group>
      </Form>
    );
  };

	return (
		<Modal show={props.modalOpen} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User {props.user.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {_getForm()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={_handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
	);
};

const PageAdminUsersModal = connect(mapStateToProps, mapDispatchToProps)(PageAdminUsersModalComponent);

export default PageAdminUsersModal;
