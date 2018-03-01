import * as React from 'react';
import './LoginButtons.scss';

interface LoginButtonsProps {}

const LoginButtons: React.SFC<LoginButtonsProps> = (props) => {
    return (
        <div>
            {AUTH_ALLOW_GITHUB ? <LoginButton name='Github' link='/auth/github/login' /> : ''}
            {AUTH_ALLOW_FACEBOOK ? <LoginButton name='Facebook' link='/auth/facebook/login' /> : ''}
            {AUTH_ALLOW_GOOGLE ? <LoginButton name='Google' link='/auth/google/login' /> : ''}
        </div>
    );
};

interface LoginButtonProps {
    name: string;
    link: string;
}

const LoginButton: React.SFC<LoginButtonProps> = (props) => {
    return (
        <div className='LoginButton'>
            <a href={props.link}>Log in with {props.name}</a>
        </div>
    );
};

export default LoginButtons;
