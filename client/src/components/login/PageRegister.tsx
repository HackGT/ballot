import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import User, { UserRole } from '../../types/User';
import { Redirect } from 'react-router';
import axios from 'axios';
import * as qs from 'querystring';

interface RegisterProps {
    account: User;
}

interface RegisterState {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    registering: boolean;
    errorVisible: boolean;
    errorTitle: string;
    errorText: string;
    success: boolean;
}

const PageRegister: React.FC<RegisterProps> = (props) => {
    const [inputs, changeInputs] = React.useState<{ [inputName: string]: string }>({
        'name': '',
        'email': '',
        'password': '',
        'passwordConfirm': '',
    });
    const [processing, changeProcessing] = React.useState(false);
    const [error, changeError] = React.useState({
        visible: false,
        title: '',
        text: '',
    });
    const [success, changeSuccess] = React.useState(false);

    const handleRegister = async (event: any) => {
        event.preventDefault();
        const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*\.[a-z]{2,4}$/;

        if (inputs['name'].length > 0 && inputs['email'].length > 0 && inputs['password'].length > 0) {
            if (inputs['password'] === inputs['passwordConfirm']) {
                if (pattern.test(inputs['email'])) {
                    changeProcessing(true);

                    const registerResult = await axios.post('/auth/signup', qs.stringify({
                        'name': inputs['name'],
                        'email': inputs['email'].toLowerCase(),
                        'password': inputs['password'],
                    }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                    });

                    console.log(registerResult);

                    if (registerResult.data.status) {
                        changeSuccess(true);
                    } else {
                        changeSuccess(false);
                        changeProcessing(false);
                        changeError({
                            visible: true,
                            title: 'Error Creating Account',
                            text: 'Account already exists.'
                        });
                    }
                } else {
                    changeError({
                        visible: true,
                        title: 'Error Creating Account',
                        text: 'Email is not valid.',
                    });
                }
            } else {
                changeError({
                    visible: true,
                    title: 'Error Creating Account',
                    text: 'Passwords do not match',
                });
            }
        } else {
            changeError({
                visible: true,
                title: 'Error Creating Account',
                text: 'Fields were left blank.',
            });
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
        return <Redirect to='/' />;
    }

    if (success) {
        return <Redirect to='/login' />;
    }

    return (
        <>
            <h1 style={{
                textAlign: 'center'
            }}>Register</h1>

            <div style={{
                maxWidth: 360,
                margin: '0 auto',
            }}>
                {error.visible
                    ? <Message
                        negative
                        onDismiss={() => changeError({...error, visible: false})}
                        header={error.title}
                        content={error.text} />
                    : null }
                <Form
                    size={'large'}
                    style={{
                        maxWidth: 360,
                        margin: '0 auto',
                    }}
                    loading={processing}>
                    <Form.Field>
                        <input
                            name='name'
                            onChange={handleChange}
                            placeholder='Name' />
                    </Form.Field>
                    <Form.Field>
                        <input
                            name='email'
                            onChange={handleChange}
                            placeholder='Email' />
                    </Form.Field>
                    <Form.Field>
                        <input
                            name='password'
                            placeholder='Password'
                            onChange={handleChange}
                            type='password' />
                    </Form.Field>
                    <Form.Field>
                        <input
                            name='passwordConfirm'
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            type='password' />
                    </Form.Field>
                    <Button
                        size='large'
                        type='submit'
                        fluid
                        color='blue'
                        onClick={handleRegister}>Register</Button>
                </Form>
            </div>
        </>
    );
}

export default PageRegister;
