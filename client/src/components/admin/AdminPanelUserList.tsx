import * as React from 'react';
import { AuthState, UserState } from '../../types/State';
import AdminPanelUserCard, { AdminPanelUserCardProps } from './AdminPanelUserCard';

interface UserTableProps {
    userData: UserState[];
    currentUser: AuthState;
    editUser: (user: UserState) => void;
    removeUser: (user: UserState) => void;
}

const AdminPanelUserList: React.SFC<UserTableProps> = (props) => {
    const tableRender: Array<React.ReactElement<HTMLDivElement>> = [];
    for (let i = 0; i < props.userData.length; i++) {
        tableRender.push(<AdminPanelUserCard
            key={i}
            user={props.userData[i]}
            isCurrentUser={props.userData[i].user_id === props.currentUser.user_id}
            editUser={props.editUser}
            removeUser={props.removeUser}
        />);
    }

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
        }}>
            {tableRender}
        </div>
    );
};

export default AdminPanelUserList;
