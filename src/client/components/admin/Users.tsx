import * as React from 'react';
import UserTable from './UserTable';
import { UserTableRowType } from './UserTableRow';

class UserContainer extends React.Component< {}, {
    userData: UserTableRowType[]}> {
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
        const newUserData: UserTableRowType[] = [];
        for (const user of users) {
            newUserData.push({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                user_class: user.user_class,
            });
        }

        this.setState({ userData: newUserData });
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <UserTable userData={this.state.userData} />
        );
    }
}

export default UserContainer;
