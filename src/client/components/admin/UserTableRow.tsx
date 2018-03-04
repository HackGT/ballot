import * as React from 'react';
import UserClassSelector from './UserClassSelector';

interface UserTableRowProps {
    user_id: number;
    name: string;
    email: string;
    user_class: string;
}

const UserTableRow: React.SFC<UserTableRowProps> = (props) => {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.email}</td>
            <td><UserClassSelector
                user_id={props.user_id}
                user_class={props.user_class} />
            </td>
        </tr>
    );
};

export default UserTableRow;
