import * as React from 'react';
import AdminPanelUserList from './AdminPanelUserList';
import { AuthState } from '../../types/State';
import { AdminPanelUserCardProps } from './AdminPanelUserCard';

interface AdminPanelUsersProps {
    auth: AuthState;
}

class AdminPanelUsers extends React.Component<AdminPanelUsersProps, {
    userData: AdminPanelUserCardProps[]}> {
    constructor(props: any) {
        super(props);

        this.state = {
            userData: [],
        };
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
        const newUserData: AdminPanelUserCardProps[] = [];
        for (const user of users) {
            newUserData.push({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                user_class: user.user_class,
                isCurrentUser: this.props.auth.email === user.email,
            });
        }

        this.setState({ userData: newUserData });
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <AdminPanelUserList userData={this.state.userData} />
        );
    }
}

export default AdminPanelUsers;
