import * as React from 'react';
import './LoginPage.css';
import Login from './login/Login';
import Header from './Header';

interface LoginPageProps {}

const LoginPage: React.SFC<LoginPageProps> = (props) => {
    return (
        <div>
            <Header />
            <Login />
        </div>
    );
};

export default LoginPage;
