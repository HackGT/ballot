import * as qs from 'querystring';
import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

import User, { roleStringToEnum } from '../../types/User';
import { AppState } from '../../state/Store';
import { loginUser, updateSocket } from '../../state/Account';
import { UIError } from '../../types/Common';
import { Redirect } from 'react-router';

const mapStateToProps = (state: AppState) => {
  return {
    account: state.account,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loginUser: (user: User) => dispatch(loginUser(user)),
    updateSocket: () => {
      dispatch(updateSocket());
    },
  };
};

interface PageLoginProps {
  account: User;
  loginUser: (user: User) => void;
  updateSocket: () => void;
}

interface Inputs {
  email: string;
  password: string;
}

type State = {
  error: UIError;
  inputs: Inputs;
  requesting: boolean;
  success: boolean;
}

type Action =
  | { type: 'change-error', error: UIError }
  | { type: 'change-inputs', inputs: Partial<Inputs> }
  | { type: 'request-success' }
  | { type: 'request-start' }
  | { type: 'request-finish' };

const PageLoginComponent: React.FC<PageLoginProps> = (props) => {
  const initialState = {
    requesting: false,
    inputs: {
      email: '',
      password: '',
    },
    error: {
      name: '',
      message: '',
    },
    success: false,
  };

  const [state, dispatch] = React.useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'change-error':
        return {
          ...state,
          error: action.error,
          requesting: false,
        };
      case 'change-inputs':
        return { ...state, inputs: {
          ...state.inputs,
          ...action.inputs,
        }};
      case 'request-start':
        return {
          ...state,
          requesting: true,
          error: { name: '', message: '' },
        };
      case 'request-finish':
        return { ...state, requesting: false, success: false };
      case 'request-success':
        return { ...state, requesting: false, success: true };
      default:
        return state;
    }
  }, initialState, undefined);

  const genErrorBox = () => {
    return state.error.name
      ? <Alert variant="danger">
          <strong>{state.error.name}</strong>
          <div>{state.error.message}</div>
        </Alert>
      : null
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    if (state.inputs.email.length === 0 || state.inputs.password.length === 0) {
      dispatch({
        type: 'change-error',
        error: {
          name: 'Error Logging In',
          message: 'One or more fields were left blank.',
        },
      });
      return;
    }
    dispatch({ type: 'request-start' });
    const loginResponse = await Axios.post('/auth/login', qs.stringify({
      'email': state.inputs.email.toLowerCase(),
      'password': state.inputs.password,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const payload = loginResponse.data;
    if (
      !loginResponse.status
      || !payload.id
      || !payload.name
      || !payload.email
      || !payload.role
    ) {
      dispatch({
        type: 'change-error',
        error: {
          name: 'Error Logging In',
          message: 'Incorrect email or password.',
        },
      });
      dispatch({ type: 'request-finish' });
      return;
    }

    props.loginUser({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      company: payload.company,
      role: roleStringToEnum(payload.role),
      tags: payload.tags,
    });
    props.updateSocket();
    dispatch({ type: 'request-success' });
  };

  if (state.success) {
    return <Redirect to='/' />;
  }

  return (
    <div style={{
      margin: '0 auto',
      maxWidth: 400,
    }}>
      <h1 style={{
        textAlign: 'center',
        paddingBottom: 10,
      }}>Login</h1>
      <Form>
        <Form.Group>
          <Form.Control
            disabled={state.requesting}
            onChange={(event: any) => dispatch({
              type: 'change-inputs',
              inputs: {
                email: event.target.value,
              },
            })}
            value={state.inputs.email}
            type='email'
            placeholder='Email' />
        </Form.Group>
        <Form.Group>
          <Form.Control
            disabled={state.requesting}
            type='password'
            placeholder='Password'
            onChange={(event: any) => dispatch({
              type: 'change-inputs',
              inputs: {
                password: event.target.value,
              },
            })} />
        </Form.Group>
        <Button
          variant='primary'
          type='submit'
          onClick={handleLogin}
          block>
          {state.requesting
            ? <Spinner animation='border' role='status' size='sm' />
            : 'Login'}
        </Button>
      </Form>
      {genErrorBox()}
    </div>
  );
};

const PageLogin = connect(mapStateToProps, mapDispatchToProps)(PageLoginComponent);

export default PageLogin;
