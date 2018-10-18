import * as React from 'react';
import AdminPanelUserList from './AdminPanelUserList';
import { AuthState, UserState } from '../../types/State';
import { AdminPanelUserCardProps } from './AdminPanelUserCard';
import { Button } from '@blueprintjs/core';

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

        this.fetchUsers = this.fetchUsers.bind(this);
    }

    public async componentWillMount(): Promise<void> {
        await this.fetchUsers();
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div>
                <h1>
                    Users
                    <span style={{
                        float: 'right',
                    }}>
                        <Button name='refresh' icon='refresh' large={true} intent='primary' minimal={true} onClick={this.fetchUsers} />
                    </span>
                </h1>
                <AdminPanelUserList
                    userData={this.props.users.sort((a, b) => {
                        return a.user_id - b.user_id;
                    })}
                    currentUser={this.props.auth}
                    editUser={this.props.editUser}
                    removeUser={this.props.removeUser} />
            </div>
        );
    }

    private async fetchUsers() {
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
}

export default AdminPanelUsers;
