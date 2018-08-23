import * as React from 'react';
import './LoginPage.css';
import Register from './login/Register';
import Header from './Header';

interface RegisterPageProps {}

const RegisterPage: React.SFC<RegisterPageProps> = (props) => {
    return (
        <div>
            <Header />
            <Register />
        </div>
    );
};

export default RegisterPage;
