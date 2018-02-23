import * as React from 'react';
// import './Users.scss';

interface UsersProps {}

const Users: React.SFC<UsersProps> = (props) => {
    return (
        <div id='register-form'>
            <h1>Welcome!</h1>
            <p>You have been approved as a Users!</p>
        </div>
    );
};

export default Users;
