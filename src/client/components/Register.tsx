import * as React from "react";
import './Register.scss';
import { Link } from 'react-router-dom';

class Register extends React.Component {
    render() {
        return (
            <div id="register-form">
                <form method="POST" action="/auth/signup">
                    <input name="name" type="text" placeholder="Name" /><br />
                    <input name="email" type="text" placeholder="Email" /><br />
                    <input name="password" type="password" placeholder="Password" /><br />
                    <input type="submit" value="Register" />
                </form>
                <Link to="/login">Back</Link>
            </div>
        )
    };
}

export default Register