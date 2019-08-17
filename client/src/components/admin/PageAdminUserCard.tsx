import React from 'react';
import { AppState } from '../../state/Store';
import User, { UserRole, clientUserToServerUser, serverDataToClientUser, getRoleString } from '../../types/User';
import { connect } from 'react-redux';
import { updateUser } from '../../state/User';
import Axios from 'axios';
import { Card, ButtonGroup, Button } from 'react-bootstrap';

const mapDispatchToProps = (dispatch: any) => {
	return {
		updateUser: (user: User) => {
      dispatch(updateUser(user));
    },
	};
};

interface PageAdminUserCardProps {
  user: User;
  openModal: (event: any, user: User) => void;
	updateUser: (user: User) => void;
}

type State = {
	requesting: boolean;
}

type Action =
	| { type: 'request-start'}
	| { type: 'request-finish'};

const PageAdminUserCardComponent: React.FC<PageAdminUserCardProps> = (props) => {
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

  const approve = async (event: any, user: User) => {
    event.preventDefault();
    dispatch({ type: 'request-start' });
    user.role = UserRole.Judge;
    const result = await Axios.post('/api/users/update', {
      user: clientUserToServerUser(user),
    });
    if (result.status) {
      props.updateUser(serverDataToClientUser(result.data));
      dispatch({ type: 'request-finish' });
    } else {
      // TODO add error checking.
    }
  };

	return (
		<Card
      key={props.user.id}
      style={{
        width: '18rem',
        margin: '12px',
      }}>
      <Card.Body>
        <Card.Title>{props.user.id}: {props.user.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{getRoleString(props.user.role)}</Card.Subtitle>
        <Card.Text>
          {props.user.email}<br />
          {props.user.tags && props.user.tags.length > 0 ? <span>{props.user.tags}</span> : <span>No tags</span>}
        </Card.Text>
        <ButtonGroup>
          <Button
            disabled={state.requesting}
            onClick={(event: any) => props.openModal(event, props.user)}
            size='sm'
            variant='primary'>
            Edit
          </Button>
          {props.user.role === UserRole.Pending
            ? <Button
                disabled={state.requesting}
                onClick={(event: any) => approve(event, props.user)}
                size='sm'
                variant='outline-success'>
                Approve
              </Button>
            : null
          }
        </ButtonGroup>
      </Card.Body>
    </Card>
	);
};

const PageAdminUserCard = connect(null, mapDispatchToProps)(PageAdminUserCardComponent);

export default PageAdminUserCard;
