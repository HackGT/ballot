import * as React from 'react';
import axios from 'axios';
import { ButtonGroup, Button } from '@blueprintjs/core';

interface LoginButtonsProps { }

const LoginButtons: React.SFC<LoginButtonsProps> = (props) => {
    return (
        <div style={{ textAlign: 'center' }}>
            {process.env.REACT_APP_AUTH_ALLOW_GITHUB ?
                <LoginButton name='Github'
                    link='/auth/github/login' /> : ''}
            {process.env.REACT_APP_AUTH_ALLOW_FACEBOOK ?
                <LoginButton name='Facebook'
                    link='/auth/facebook/login' /> : ''}
            {process.env.REACT_APP_AUTH_ALLOW_GOOGLE ?
                <LoginButton name='Google'
                    link='/auth/google/login' /> : ''}
        </div>
    );
};

interface LoginButtonProps {
    name: string;
    link: string;
}

class LoginButton extends React.Component<LoginButtonProps, {}> {
    constructor(props: LoginButtonProps) {
        super(props);
    }

    public render() {
        return (
            <Button text={`Log in with ${this.props.name}`} onClick={() => {
                if (window) {
                    window.location.href = this.props.link;
                }
            }} />
        );
    }
};

export default LoginButtons;
