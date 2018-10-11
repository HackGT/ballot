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
    loggingIn: boolean;
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
            loggingIn: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    public render() {
        return (
            <div style={{
                maxWidth: 480,
                width: '100%',
                textAlign: 'center',
                margin: '0 auto',
             }}>
                <H1>Login</H1>
                <LoginButtons />
                <form>
                    <InputGroup
                        name='email'
                        type='email'
                        autoComplete='off'
                        placeholder='Email'
                        autoCapitalize='off'
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
                    <Button
                        type='submit'
                        text='Login'
                        loading={this.state.loggingIn}
                        large={true}
                        intent='primary'
                        fill={true}
                        onClick={this.handleLogin} />
                </form>
            </div>
        );
    }

    private handleLogin(event: any) {
        event.preventDefault();
        this.setState((prevState) => {
            return {
                ...prevState,
                loggingIn: true,
            };
        }, async () => {
            const loginResult = await axios.post('/auth/login',
                qs.stringify({
                    'email': this.state.email.toLowerCase(),
                    'password': this.state.password,
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                }
            );

            if (loginResult.data.class !== 'None') {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        loggingIn: false,
                    };
                });
            }

            this.props.updateClass({
                name: loginResult.data.name,
                email: loginResult.data.email,
                class: loginResult.data.class,
                user_id: loginResult.data.user_id,
            });
        });
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
