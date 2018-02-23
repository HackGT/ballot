import * as React from 'react';
import './Login.scss';
import Register from './login/Register';
import Header from './Header';
import Navigation from './Navigation';

interface RegisterPageProps {}

const RegisterPage: React.SFC<RegisterPageProps> = (props) => {
    return (
        <div>
            <Header />
            <Navigation />
            <Register />
        </div>
    );
};

export default RegisterPage;
