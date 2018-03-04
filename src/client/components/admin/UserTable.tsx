import * as React from 'react';
import './UserTable.scss';

interface UserTableProps {
    userData: Array<React.ReactElement<HTMLDivElement>>;
}

const UserTable: React.SFC<UserTableProps> = (props) => {
    return (
        <div className='user-table'>
            <table>
                <tbody>{props.userData}</tbody>
            </table>
        </div>
    );
};

export default UserTable;
