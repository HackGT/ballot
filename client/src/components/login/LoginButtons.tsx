import * as React from 'react';
import './LoginButtons.css';

interface LoginButtonsProps { }

const LoginButtons: React.SFC<LoginButtonsProps> = (props) => {
    return (
        <div>
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

const LoginButton: React.SFC<LoginButtonProps> = (props) => {
    return (
        <div className='LoginButton'>
            <a href={props.link}>Log in with {props.name}</a>
        </div>
    );
};

export default LoginButtons;
