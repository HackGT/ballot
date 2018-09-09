import * as React from 'react';
import AdminPanelUserCard, { AdminPanelUserCardProps } from './AdminPanelUserCard';

interface UserTableProps {
    userData: AdminPanelUserCardProps[];
}

const AdminPanelUserList: React.SFC<UserTableProps> = (props) => {
    const tableRender: Array<React.ReactElement<HTMLDivElement>> = [];
    for (let i = 0; i < props.userData.length; i++) {
        tableRender.push(<AdminPanelUserCard
            key={i}
            user_id={props.userData[i].user_id}
            name={props.userData[i].name}
            email={props.userData[i].email}
            user_class={props.userData[i].user_class}
            isCurrentUser={props.userData[i].isCurrentUser}
        />);
    }

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
        }}>
            {tableRender}
        </div>
    );
};

export default AdminPanelUserList;
