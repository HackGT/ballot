import * as qs from 'querystring';
import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import User from '../../types/User';
import { AppState } from '../../state/Store';
import { loginUser } from '../../state/Account';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { UIError } from '../../types/Common';
import { Redirect } from 'react-router';

const mapStateToProps = (state: AppState) => {
  return {
    account: state.account,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loginUser: (user: User) => {
      dispatch(loginUser(user));
    },
  };
};

interface PageRegisterProps {
  account: User;
  loginUser: (user: User) => void;
}

interface Inputs {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

type State = {
  requesting: boolean;
  inputs: Inputs;
  error: UIError;
  success: boolean;
}

type Action =
  | { type: 'change-error', error: UIError }
  | { type: 'change-inputs', inputs: Partial<Inputs> }
  | { type: 'request-start'}
  | { type: 'request-success'}
  | { type: 'request-finish'};

const PageRegisterComponent: React.FC<PageRegisterProps> = (props) => {
  const initialState = {
    requesting: false,
    inputs: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
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
      case 'request-success':
        return { ...state, success: true, requesting: false };
      case 'request-finish':
        return { ...state, requesting: false, success: false };
      default:
        return state;
    }
  }, initialState, undefined);

  const handleRegister = async (event: any) => {
    event.preventDefault();
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    if (state.inputs.name.length === 0
      || state.inputs.email.length === 0
      || state.inputs.password.length === 0
      || state.inputs.passwordConfirm.length === 0) {
      dispatch({
        type: 'change-error',
        error: {
          name: 'Error Creating Account',
          message: 'One or more fields were left blank.',
        },
      });
      return;
    }
    if (!pattern.test(state.inputs.email)) {
      dispatch({
        type: 'change-error',
        error: {
          name: 'Error Creating Account',
          message: 'Your email is invalid.',
        },
      });
      return;
    }
    if (state.inputs.password !== state.inputs.passwordConfirm) {
      dispatch({
        type: 'change-error',
        error: {
          name: 'Error Creating Account',
          message: 'Your passwords do not match.',
        },
      });
      return;
    }

    dispatch({ type: 'request-start' });
    const registerResult = await Axios.post('/auth/signup', qs.stringify({
      'name': state.inputs.name,
      'email': state.inputs.email,
      'password': state.inputs.password,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!registerResult.data.status) {
      dispatch({
        type: 'change-error',
        error: {
          name: 'Error Creating Account',
          message: 'Account already exists.',
        }
      });
      return;
    }
    dispatch({ type: 'request-success' });
  }

  const genErrorBox = () => {
    return state.error.name
      ? <Alert variant="danger">
          <strong>{state.error.name}</strong>
          <div>{state.error.message}</div>
        </Alert>
      : null
  };


  if (state.success) {
    return <Redirect to='/login' />;
  }

  return (
    <div style={{
      margin: '0 auto',
      maxWidth: 400,
    }}>
      <h1 style={{
        textAlign: 'center',
        paddingBottom: 10,
      }}>Register</h1>
      <Form>
        <Form.Group>
          <Form.Control
            disabled={state.requesting}
            onChange={(event: any) => dispatch({
              type: 'change-inputs',
              inputs: {
                name: event.target.value,
              },
            })}
            value={state.inputs.name}
            type="text"
            placeholder="Name" />
        </Form.Group>
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
            type="email"
            placeholder="Email" />
        </Form.Group>
        <Form.Group>
          <Form.Control
            disabled={state.requesting}
            onChange={(event: any) => dispatch({
              type: 'change-inputs',
              inputs: {
                password: event.target.value,
              },
            })}
            value={state.inputs.password}
            type="password"
            placeholder="Password" />
        </Form.Group>
        <Form.Group>
          <Form.Control
            disabled={state.requesting}
            onChange={(event: any) => dispatch({
              type: 'change-inputs',
              inputs: {
                passwordConfirm: event.target.value,
              },
            })}
            value={state.inputs.passwordConfirm}
            type="password"
            placeholder="Password (confirm)" />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          onClick={handleRegister}
          block>{state.requesting
            ? <Spinner animation='border' role='status' size='sm' />
            : 'Register'}</Button>
        {genErrorBox()}
      </Form>
    </div>
  );
};

const PageRegister = connect(mapStateToProps, mapDispatchToProps)(PageRegisterComponent);

export default PageRegister;
