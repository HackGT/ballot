import * as React from 'react';
// import './Users.scss';

interface UsersProps {}

const Users: React.SFC<UsersProps> = (props) => {
    return (
        <div>
            <h1>Users</h1>
            <p>This is where user management will be.</p>
        </div>
    );
};

export default Users;
