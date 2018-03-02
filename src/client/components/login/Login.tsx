import * as React from 'react';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Authorization from '../Authorization';
import LoginButtons from './LoginButtons';
import YesSession from '../../util/RedirectYesSession';

const UserAuth = Authorization(['Pending', 'Judge', 'Admin', 'Owner']);

interface LoginProps { }

const Login: React.SFC<LoginProps> = (props) => {
    const localAuthForm = <form action='/auth/login' method='POST'>
        <input name='email' type='text' placeholder='Email' />
        <input name='password' type='password' placeholder='Password' />
        <input type='submit' value='Login' />
    </form>;

    return (
        <div className='login'>
            <h2>Login</h2>
            <Route path='/login' component={UserAuth(YesSession)} />
            <LoginButtons />
            {AUTH_ALLOW_LOCAL ? localAuthForm : ''}

            <Link to='/register'>Register</Link>
        </div>
    );
};

export default Login;
