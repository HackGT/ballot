import * as React from 'react';
import { Link } from 'react-router-dom';

interface RegisterProps {}

const Register: React.SFC<RegisterProps> = (props) => {
    return (
        <div className='login'>
        <h2>Register</h2>
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
