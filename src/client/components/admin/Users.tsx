import * as React from 'react';
import UserTable from './UserTable';
// import './Users.scss';

interface UsersProps {}

const Users: React.SFC<UsersProps> = (props) => {
    return (
        <div>
            <UserTable />
        </div>
    );
};

export default Users;
