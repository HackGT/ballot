import * as React from 'react';
import './LoginPage.scss';
import Login from './login/Login';
import Header from './Header';
import Navigation from './Navigation';

interface LoginPageProps {}

const LoginPage: React.SFC<LoginPageProps> = (props) => {
    return (
        <div>
            <Header />
            <Navigation />
            <Login />
        </div>
    );
};

export default LoginPage;
