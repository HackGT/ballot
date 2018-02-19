import * as React from "react";
import './Login.scss';
import Login from './login/Login';
import Header from './Header';
import Navigation from './Navigation';

const LoginPage = (props: any) => {
    return (
        <div>
            <Header />
            <Navigation />
            <Login />
        </div>
    );
}

export default LoginPage