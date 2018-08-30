import * as React from 'react';
import axios from 'axios';
import * as qs from 'querystring';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { FormGroup, InputGroup, Button, H1 } from '@blueprintjs/core';
import LoginButtons from './LoginButtons';
import YesSessionContainer from '../../util/RedirectYesSession';
import { UpdateClassRequestType } from '../../types/UpdateClass';

interface LoginProps {
    updateClass: (json: UpdateClassRequestType) => void;
}

interface LoginState {
    email: string;
    password: string;
}

const spacedInput = {
    margin: '0 0 20px',
};

class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    public render() {
        return (
            <div style={{
                maxWidth: 480,
                width: '100%',
                margin: '0 auto',
             }}>
                <Route path='/login' component={YesSessionContainer} />
                <LoginButtons />
                {process.env.REACT_APP_AUTH_ALLOW_LOCAL ?
                    <FormGroup>
                        <InputGroup
                            name='email'
                            type='text'
                            placeholder='Email'
                            large={true}
                            onChange={this.handleChange}
                            style={spacedInput} />
                        <InputGroup
                            name='password'
                            type='password'
                            placeholder='Password'
                            large={true}
                            onChange={this.handleChange}
                            style={spacedInput} />
                        <Button type='submit' value='Login' large={true} intent='primary' fill={true} onClick={this.handleLogin}>Login</Button>
                    </FormGroup> :
                    ''
                }

                <Link to='/register'>Register</Link>
            </div>
        );
    }

    private async handleLogin() {
        const loginResult = await axios.post('/auth/login',
            qs.stringify({
                'email': this.state.email,
                'password': this.state.password,
            }),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        this.props.updateClass(loginResult.data);
    }

    private handleChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        });
    }
};

export default Login;
