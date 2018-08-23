import * as React from 'react';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import LoginButtons from './LoginButtons';
import YesSessionContainer from '../../util/RedirectYesSession';

interface LoginProps {}

const Login: React.SFC<LoginProps> = (props) => {
    const localAuthForm = <form action='/auth/login' method='POST'>
        <input name='email' type='text' placeholder='Email' />
        <input name='password' type='password' placeholder='Password' />
        <input type='submit' value='Login' />
    </form>;

    return (
        <div className='login'>
            <h2>Login</h2>
            <Route path='/login' component={YesSessionContainer} />
            <LoginButtons />
            {process.env.REACT_APP_AUTH_ALLOW_LOCAL ? localAuthForm : ''}

            <Link to='/register'>Register</Link>
        </div>
    );
};

export default Login;
