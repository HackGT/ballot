import * as React from 'react';
import './UserTable.scss';

interface UserTableProps {}

class UserTable extends React.Component<{}, { userData: Array<React.ReactElement<any>> }> {
    constructor(props: any) {
        super(props);

        this.state = {
            userData: [],
        };
    }

    public async componentDidMount(): Promise<void> {
        const result = await fetch('/graphql', {
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
        const newUserData: Array<React.ReactElement<any>> = [];
        for (let i = 0; i < users.length; i++) {
            newUserData.push(<UserTableRow key={i} user_id={users[i].user_id} name={users[i].name} email={users[i].email} user_class={users[i].user_class} />);
        }

        this.setState({userData: newUserData});
    }

    private compare(a: React.ReactElement<any>, b: React.ReactElement<any>) {

    }

    public render(): React.ReactElement<any> {
        return (
            <div className='user-table'>
                <table>
                    <tbody>{this.state.userData}</tbody>
                </table>
            </div>
        );
    }
}

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
            <td><UserClassSelector user_id={props.user_id} user_class={props.user_class} /></td>
        </tr>
    );
};

interface UserClassSelectorProps {
    user_class: string;
}

class UserClassSelector extends React.Component<{ user_id: number, user_class: string }, { user_id: number, user_class: string } > {
    constructor(props: any) {
        super(props);

        this.state = {
            user_id: props.user_id,
            user_class: props.user_class,
        };

        this.changeClass = this.changeClass.bind(this);
    }

    public render(): React.ReactElement<any> {
        return (
            <div className='class-selector'>
                <button onClick={() => this.changeClass('Pending')} className={this.state.user_class === 'Pending' ? 'selected' : null}>Pending</button>
                <button onClick={() => this.changeClass('Judge')} className={this.state.user_class === 'Judge' ? 'selected' : null}>Judge</button>
                <button onClick={() => this.changeClass('Admin')} className={this.state.user_class === 'Admin' ? 'selected' : null}>Admin</button>
                <button onClick={() => this.changeClass('Owner')} className={this.state.user_class === 'Owner' ? 'selected' : null}>Owner</button>
            </div>
        );
    }

    private async changeClass(newClass: string): Promise<void> {
        const currentUser = this.state.user_id;
        const result = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: 'mutation {changeUserClass(id:' + currentUser
                + ', newClass:' + newClass + ') { user_id, user_class }}',
            }),
        });
        const data = await result.json();
        this.setState({user_class: data.data.changeUserClass.user_class});
    }
}

export default UserTable;
