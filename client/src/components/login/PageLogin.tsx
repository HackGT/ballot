import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import User, { UserRole, roleStringToEnum } from '../../types/User';
import { Redirect } from 'react-router';
import axios from 'axios';
import * as qs from 'querystring';

interface LoginProps {
    account: User;
    loginUser: (user: User) => void;
}

const PageLogin: React.FC<LoginProps> = (props) => {
    const [inputs, changeInputs] = React.useState<{ [fieldName: string]: string }>({
        'email': '',
        'password': '',
    });
    const [loggingIn, changeLoggingIn] = React.useState(false);
    const [errorVisible, changeErrorVisible] = React.useState(false);
    const [errorTitle, changeErrorTitle] = React.useState('');
    const [errorText, changeErrorText] = React.useState('');

    const handleLogin = async (event: any) => {
        event.preventDefault();
        if (inputs['email'].length > 0 && inputs['password'].length > 0) {
            changeLoggingIn(true);

            const loginResult = await axios.post('/auth/login', qs.stringify({
                'email': inputs['email'].toLowerCase(),
                'password': inputs['password'],
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            });

            if (loginResult.data.id) {
                changeLoggingIn(false);
                props.loginUser({
                    id: loginResult.data.id,
                    name: loginResult.data.name,
                    email: loginResult.data.email,
                    role: roleStringToEnum(loginResult.data.role),
                    tags: loginResult.data.tags,
                });
            } else {
                changeLoggingIn(false);
                changeErrorVisible(true);
                changeErrorTitle('Error Logging In');
                changeErrorText('Incorrect email or password.');
            }
        } else {
            changeErrorVisible(true);
            changeErrorTitle('Error Logging In');
            changeErrorText('Email or password are blank.');
        }
    }

    const handleChange = (event: any) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        changeInputs({
            ...inputs,
            [name]: value,
        });
    }

    if (props.account.role > UserRole.None) {
        return <Redirect to='/' />
    }

    return (
        <>
            <h1 style={{
                textAlign: 'center'
            }}>Login</h1>
            <div style={{
                maxWidth: 360,
                margin: '0 auto'
            }}>
                {errorVisible
                    ? <Message
                        negative
                        onDismiss={() => changeErrorVisible(false)}
                        header={errorTitle}
                        content={errorText} />
                    : null }
                <Form
                    size={'large'}
                    loading={loggingIn}>
                    <Form.Field>
                        <input
                            name='email'
                            autoComplete='off'
                            placeholder='Email'
                            onChange={handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <input
                            name='password'
                            placeholder='Password'
                            onChange={handleChange}
                            type='password' />
                    </Form.Field>
                    <Button
                        size='large'
                        type='submit'
                        fluid
                        color='blue'
                        onClick={handleLogin}>Log In</Button>
                </Form>
            </div>
        </>
    );
}

export default PageLogin;
