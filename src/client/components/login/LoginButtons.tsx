import * as React from 'react';
import './LoginButtons.scss';

interface LoginButtonsProps {}

const LoginButtons: React.SFC<LoginButtonsProps> = (props) => {
    return (
        <div>
            {process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? <LoginButton name='Github' link='/auth/github/login' /> : ''}
            {process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET ? <LoginButton name='Facebook' link='/auth/facebook/login' /> : ''}
            {process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? <LoginButton name='Google' link='/auth/google/login' /> : ''}
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
