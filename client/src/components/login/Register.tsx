import * as React from 'react';
import { Link } from 'react-router-dom';

interface RegisterProps {}

const Register: React.SFC<RegisterProps> = (props) => {
    return (
        <div style={{
            maxWidth: 480,
            width: '100%',
            margin: '0 auto',
         }}>
            <h1>Register</h1>
            <form method='POST' action='/auth/signup'>
                <input name='name' type='text' placeholder='Name' />
                <input name='email' type='text' placeholder='Email' />
                <input name='password' type='password' placeholder='Password' />
                <input type='submit' value='Register' />
            </form>
            <Link to='/login'>Back</Link>
        </div>
    );
};

export default Register;
