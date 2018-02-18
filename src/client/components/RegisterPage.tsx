import * as React from "react";
import './Login.scss';
import Register from './login/Register';
import Header from './Header';
import Navigation from './Navigation';

class RegisterPage extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Navigation />
                <Register />
            </div>
        )
    };
}

export default RegisterPage