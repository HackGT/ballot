import * as React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { UserState } from '../../types/State';

interface UserClassSelectorProps {
    user: UserState;
    disabled: boolean;
    editUser: (user: UserState) => void;
}

class UserClassSelector extends React.Component<UserClassSelectorProps, {}> {
    constructor(props: any) {
        super(props);

        this.changeClass = this.changeClass.bind(this);
    }

    public render() {
        return (
            <ButtonGroup>
                <Button onClick={() => this.changeClass('Pending')}
                    disabled={this.props.disabled}
                    small={true}
                    active={this.props.user.user_class === 'Pending'}>Pending</Button>
                <Button onClick={() => this.changeClass('Judge')}
                    disabled={this.props.disabled}
                    small={true}
                    active={this.props.user.user_class === 'Judge'}>Judge</Button>
                <Button onClick={() => this.changeClass('Admin')}
                    disabled={this.props.disabled}
                    small={true}
                    active={this.props.user.user_class === 'Admin'}>Admin</Button>
                <Button onClick={() => this.changeClass('Owner')}
                    disabled={this.props.disabled}
                    small={true}
                    active={this.props.user.user_class === 'Owner'}>Owner</Button>
            </ButtonGroup>
        );
    }

    private async changeClass(newClass: string): Promise<void> {
        const result = await fetch('/graphql', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: 'mutation {changeUserClass(id:' + this.props.user.user_id
                + ', newClass:' + newClass + ') { user_id, user_class }}',
            }),
        });
        const data = await result.json();
        this.props.editUser({
            ...this.props.user,
            user_class: newClass,
        });
        this.setState({user_class: data.data.changeUserClass.user_class});
    }
}

export default UserClassSelector;
