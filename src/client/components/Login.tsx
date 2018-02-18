import * as React from "react";
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Authorization from "./Auth";
import YesSession from './YesSession';
import './Login.scss';

const UserAuth = Authorization(['Pending', 'Judge', 'Admin', 'Owner']);

class Login extends React.Component {
    render() {
        return (
            <div id="login-form">
                <Route path="/login" component={UserAuth(YesSession)} />
                <a href="/auth/google/login">Login with Google</a>
                <a href="/auth/facebook/login">Login with Facebook</a>
                <a href="/auth/github/login">Login with Github</a>

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