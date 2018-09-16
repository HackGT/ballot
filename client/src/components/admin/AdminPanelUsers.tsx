import * as React from 'react';
import AdminPanelUserList from './AdminPanelUserList';
import { AuthState, UserState } from '../../types/State';
import { AdminPanelUserCardProps } from './AdminPanelUserCard';

interface AdminPanelUsersProps {
    auth: AuthState;
    users: UserState[];
    refreshUsers: (users: UserState[]) => void;
    addUser: (user: UserState) => void;
    editUser: (user: UserState) => void;
    removeUser: (user: UserState) => void;
}

class AdminPanelUsers extends React.Component<AdminPanelUsersProps, {}> {
    constructor(props: any) {
        super(props);
    }

    public async componentWillMount(): Promise<void> {
        const result = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: '{users { user_id, name, email, user_class }}',
            }),
        });
        const data = await result.json();
        const users = data.data.users;
        const newUserData: UserState[] = [];
        for (const user of users) {
            newUserData.push({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                user_class: user.user_class,
            });
        }

        this.props.refreshUsers(newUserData);
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <AdminPanelUserList
                userData={this.props.users}
                currentUser={this.props.auth}
                editUser={this.props.editUser}
                removeUser={this.props.removeUser} />
        );
    }
}

export default AdminPanelUsers;
