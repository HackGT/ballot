import * as React from 'react';
import UserTable from './UserTable';
import UserTableRow from './UserTableRow';
// import './Users.scss';

interface UsersProps {
    userData: Array<React.ReactElement<HTMLDivElement>>;
}

const Users: React.SFC<UsersProps> = (props) => {
    return (
        <div>
            <UserTable userData={props.userData} />
        </div>
    );
};

export default Users;
