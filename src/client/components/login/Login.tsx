import * as React from "react";
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Authorization from "../Auth";
import YesSession from '../YesSession';
import LoginButtons from './LoginButtons';

const UserAuth = Authorization(['Pending', 'Judge', 'Admin', 'Owner']);

class Login extends React.Component {
    render() {
        return (
            <div id="form">
                <h2>Login</h2>
                <Route path="/login" component={UserAuth(YesSession)} />
                <LoginButtons />

                <form action="/auth/login" method="POST">
                    <input name="email" type="text" placeholder="Email" /><br />
                    <input name="password" type="password" placeholder="Password" /><br />
                    <input type="submit" value="Login" />
                </form>

                <Link to="/register">Register</Link>
            </div>
        )
    };
}

export default Login