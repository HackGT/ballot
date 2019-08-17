import React from 'react';
import { AppState } from '../../state/Store';
import User, { UserRole, getRoleEnum, serverDataToClientUser, clientUserToServerUser } from '../../types/User';
import { connect } from 'react-redux';
import { Modal, ToggleButtonGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { ButtonToolbar } from 'react-bootstrap';
import { ToggleButton } from 'react-bootstrap';
import Axios from 'axios';
import { updateUser } from '../../state/User';

const mapStateToProps = (state: AppState) => {
	return {
		account: state.account,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		updateUser: (user: User) => {
			dispatch(updateUser(user));
		},
	};
};

interface PageAdminUsersModalProps {
  account: User;
  modalOpen: boolean;
  user: User;
  closeModal: () => void;
	updateUser: (user: User) => void;
}

type State = {
  requesting: boolean;
  user: User;
}

type Action =
	| { type: 'request-start'}
  | { type: 'request-finish'}
  | { type: 'update-user', user: User };

const PageAdminUsersModalComponent: React.FC<PageAdminUsersModalProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'request-start':
				return { ...state, requesting: true };
			case 'request-finish':
        return { ...state, requesting: false };
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

  const handleSaveChanges = async () => {
    dispatch({ type: 'request-start' });
    const result = await Axios.post('/api/users/update', {
      user: clientUserToServerUser(state.user),
    });
    if (result.status) {
      const data = result.data;
      dispatch({ type: 'request-finish' });
      props.closeModal();
      props.updateUser(serverDataToClientUser(data));
    } else {
      // TODO add error checking.
    }
  };

  const getForm = () => {
    return (
      <Form>
        <Form.Group>
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
          <Button variant='outline-danger'>Reset Password</Button>
        </Form.Group>
      </Form>
    );
  };

	return (
		<Modal show={props.modalOpen} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getForm()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
	);
};

const PageAdminUsersModal = connect(mapStateToProps, mapDispatchToProps)(PageAdminUsersModalComponent);

export default PageAdminUsersModal;
