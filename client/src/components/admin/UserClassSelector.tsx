import * as React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';

interface UserClassSelectorProps {
    user_id: number;
    user_class: string;
    disabled: boolean;
}

class UserClassSelector extends React.Component<
    UserClassSelectorProps,
    { user_id: number, user_class: string }> {
    constructor(props: any) {
        super(props);

        this.state = {
            user_id: props.user_id,
            user_class: props.user_class,
        };

        this.changeClass = this.changeClass.bind(this);
    }

    public render() {
        return (
            <ButtonGroup>
                <Button onClick={() => this.changeClass('Pending')}
                    disabled={this.props.disabled}
                    small={true}
                    active={this.state.user_class === 'Pending'}>Pending</Button>
                <Button onClick={() => this.changeClass('Judge')}
                    disabled={this.props.disabled}
                    small={true}
                    active={this.state.user_class === 'Judge'}>Judge</Button>
                <Button onClick={() => this.changeClass('Admin')}
                    disabled={this.props.disabled}
                    small={true}
                    active={this.state.user_class === 'Admin'}>Admin</Button>
                <Button onClick={() => this.changeClass('Owner')}
                    disabled={this.props.disabled}
                    small={true}
                    active={this.state.user_class === 'Owner'}>Owner</Button>
            </ButtonGroup>
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
