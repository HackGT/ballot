import Axios from 'axios';
import React from 'react';
import { Badge, Card, ButtonGroup, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import User, { UserRole, clientUserToServerUser, serverDataToClientUser, getRoleString } from '../../types/User';
import { updateUser } from '../../state/User';
import { requestFinish, requestStart } from '../../state/Request';
import { AppState } from '../../state/Store';

const mapStateToProps = (state: AppState) => {
  return {
    requesting: state.requesting,
  }
}

const mapDispatchToProps = (dispatch: any) => {
	return {
    requestFinish: () => {
			dispatch(requestFinish());
		},
		requestStart: () => {
			dispatch(requestStart());
		},
		updateUser: (user: User) => {
      dispatch(updateUser(user));
    },
	};
};

interface PageAdminUserCardProps {
  requesting: boolean;
  user: User;
  openModal: (event: any, user: User) => void;
  requestFinish: () => void;
	requestStart: () => void;
	updateUser: (user: User) => void;
}

const PageAdminUserCardComponent: React.FC<PageAdminUserCardProps> = (props) => {
  const approve = async (event: any, user: User) => {
    event.preventDefault();
    props.requestStart();
    user.role = UserRole.Judge;
    user.isJudging = true;
    const result = await Axios.post('/api/users/update', {
      user: clientUserToServerUser(user),
    });
    if (result.status) {
      props.updateUser(serverDataToClientUser(result.data));
      props.requestFinish();
    } else {
      // TODO add error checking.
    }
  };

  const includeExclude = async (event: any, user: User, include: boolean) => {
    event.preventDefault();
    props.requestStart();
    user.isJudging = include;
    const result = await Axios.post('/api/users/update', {
      user: clientUserToServerUser(user),
    });
    if (result.status) {
      props.updateUser(serverDataToClientUser(result.data));
      props.requestFinish();
    } else {
      // TODO add error checking.
    }
  };

  const getActionButtons = (user: User) => {
    if (user.role === UserRole.Pending) {
      return (
        <Button
          disabled={props.requesting}
          onClick={(event: any) => approve(event, props.user)}
          size='sm'
          variant='outline-success'>
          Approve
        </Button>
      );
    } else if (user.isJudging) {
      return (
        <Button
          disabled={props.requesting}
          onClick={(event: any) => includeExclude(event, props.user, false)}
          size='sm'
          variant='outline-danger'>
          Exclude From Judging
        </Button>
      );
    } else {
      return (
        <Button
          disabled={props.requesting}
          onClick={(event: any) => includeExclude(event, props.user, true)}
          size='sm'
          variant='outline-success'>
          Include In Judging
        </Button>
      );
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
        <Card.Subtitle className="mb-2 text-muted">
          {getRoleString(props.user.role)}
          <Badge variant={props.user.isJudging ? 'success' : 'light'} style={{ margin: 5 }}>{props.user.isJudging ? 'Included In Judging' : 'Excluded From Judging'}</Badge>
        </Card.Subtitle>
        <Card.Text>
          {props.user.email}<br />
          {props.user.tags && props.user.tags.length > 0 ? <span>{props.user.tags}</span> : <span>No tags</span>}
        </Card.Text>
        <ButtonGroup>
          <Button
            disabled={props.requesting}
            onClick={(event: any) => props.openModal(event, props.user)}
            size='sm'
            variant='primary'>
            Edit
          </Button>
          {getActionButtons(props.user)}
        </ButtonGroup>
      </Card.Body>
    </Card>
	);
};

const PageAdminUserCard = connect(mapStateToProps, mapDispatchToProps)(PageAdminUserCardComponent);

export default PageAdminUserCard;
