import * as React from 'react';
import Users from './Users';
import UserTableRow from './UserTableRow';

class UserContainer extends React.Component< {}, {
    userData: Array<React.ReactElement<HTMLDivElement>>} > {
    constructor(props: any) {
        super(props);

        this.state = {
            userData: [],
        };
    }

    public async componentDidMount(): Promise<void> {
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
        const newUserData: Array<React.ReactElement<HTMLDivElement>> = [];
        for (let i = 0; i < users.length; i++) {
            newUserData.push(<UserTableRow
                key={i}
                user_id={users[i].user_id}
                name={users[i].name}
                email={users[i].email}
                user_class={users[i].user_class} />);
        }

        this.setState({ userData: newUserData });
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <Users userData={this.state.userData} />
        );
    }
}

export default UserContainer;
