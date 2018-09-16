import * as React from 'react';
import axios from 'axios';
import * as qs from 'querystring';
import { Link, Redirect } from 'react-router-dom';
import { H1, InputGroup, Button } from '@blueprintjs/core';

interface RegisterProps {}

interface RegisterState {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    registering: boolean;
    success: boolean;
    errorMessage: string;
}

const spacedInput = {
    margin: '0 0 20px',
};

class Register extends React.Component<RegisterProps, RegisterState> {
    constructor(props: RegisterProps) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
            registering: false,
            success: false,
            errorMessage: '',
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        if (this.state.success) {
            return (
                <Redirect to='/login' />
            );
        } else {
            return (
                <div style={{
                    maxWidth: 480,
                    width: '100%',
                    textAlign: 'center',
                    margin: '0 auto',
                 }}>
                    <H1>Register</H1>
                    <strong>{this.state.errorMessage}</strong>
                    <form>
                        <InputGroup
                            name='name'
                            type='text'
                            placeholder='Name'
                            large={true}
                            onChange={this.handleChange}
                            style={spacedInput} />
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
                        <InputGroup
                            name='passwordConfirm'
                            type='password'
                            placeholder='Confirm Password'
                            large={true}
                            onChange={this.handleChange}
                            style={spacedInput} />
                        <Button
                            type='submit'
                            text='Register'
                            loading={this.state.registering}
                            large={true}
                            intent='primary'
                            fill={true}
                            onClick={this.handleRegister} />
                    </form>
                    <Link to='/login'>Back</Link>
                </div>
            );
        }
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

    private handleRegister(event: any) {
        event.preventDefault();
        const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
        if (this.state.passwordConfirm === this.state.password && pattern.test(this.state.email) && this.state.name) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    registering: true,
                    errorMessage: '',
                };
            }, async () => {
                const registerResult = await axios.post('/auth/signup', qs.stringify({
                    'name': this.state.name,
                    'email': this.state.email,
                    'password': this.state.password,
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                });

                if (registerResult.data.status) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            success: true,
                        };
                    });
                } else {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            success: false,
                            registering: false,
                            errorMessage: registerResult.data.message,
                        };
                    });
                }
            });
        } else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    errorMessage: 'One or more of the inputs is not valid.'
                };
            });
        }
    }
};

export default Register;
