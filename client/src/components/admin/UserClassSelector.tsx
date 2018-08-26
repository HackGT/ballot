import * as React from 'react';

interface UserClassSelectorProps {
    user_class: string;
}

class UserClassSelector extends React.Component<
    { user_id: number, user_class: string },
    { user_id: number, user_class: string }> {
    constructor(props: any) {
        super(props);

        this.state = {
            user_id: props.user_id,
            user_class: props.user_class,
        };

        this.changeClass = this.changeClass.bind(this);
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div className='class-selector'>
                <button onClick={() => this.changeClass('Pending')}
                    className={this.state.user_class === 'Pending' ?
                    'selected' : undefined}>Pending</button>
                <button onClick={() => this.changeClass('Judge')}
                    className={this.state.user_class === 'Judge' ?
                    'selected' : undefined}>Judge</button>
                <button onClick={() => this.changeClass('Admin')}
                    className={this.state.user_class === 'Admin' ?
                    'selected' : undefined}>Admin</button>
                <button onClick={() => this.changeClass('Owner')}
                    className={this.state.user_class === 'Owner' ?
                    'selected' : undefined}>Owner</button>
            </div>
        );
    }

    private async changeClass(newClass: string): Promise<void> {
        const currentUser = this.state.user_id;
        const result = await fetch('/graphql', {
            method: 'POST',
            credentials: 'same-origin',
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

export default UserClassSelector;
