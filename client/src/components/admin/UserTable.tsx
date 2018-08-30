import * as React from 'react';
import UserTableRow from './UserTableRow';
import { UserTableRowType } from './UserTableRow';

interface UserTableProps {
    userData: UserTableRowType[];
}

const UserTable: React.SFC<UserTableProps> = (props) => {
    const tableRender: Array<React.ReactElement<HTMLDivElement>> = [];
    for (let i = 0; i < props.userData.length; i++) {
        tableRender.push(<UserTableRow
            key={i}
            user_id={props.userData[i].user_id}
            name={props.userData[i].name}
            email={props.userData[i].email}
            user_class={props.userData[i].user_class}
        />);
    }

    return (
        <div className='user-table'>
            <table>
                <tbody>{tableRender}</tbody>
            </table>
        </div>
    );
};

export default UserTable;
