import * as React from 'react';
import axios from 'axios';
import UserClassSelector from './UserClassSelector';
import { Card, Button, EditableText, Popover, Alert } from '@blueprintjs/core';

export interface AdminPanelUserCardProps {
    user_id: number;
    name: string;
    email: string;
    user_class: string;
    isCurrentUser: boolean;
}

export interface AdminPanelUserCardState {
    name: string;
    email: string;
    editMode: boolean;
    deleteOpen: boolean;
}

class AdminPanelUserCard extends React.Component<AdminPanelUserCardProps, AdminPanelUserCardState> {
    constructor(props: AdminPanelUserCardProps) {
        super(props);

        this.state = {
            name: props.name,
            email: props.email,
            editMode: false,
            deleteOpen: false,
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
    }

    public render() {
        return (
            <Card style={{
                margin: 10,
                width: 270,
            }}>
                <Alert
                    isOpen={this.state.deleteOpen}
                    cancelButtonText='Cancel'
                    confirmButtonText='Delete'
                    canOutsideClickCancel={true}
                    canEscapeKeyCancel={true}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleSave}
                    intent='danger'>
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete this user?</p>
                </Alert>
                <h3>
                    {this.props.user_id}: <EditableText defaultValue={this.props.name} disabled={!this.state.editMode} onChange={this.handleNameChange} />
                    <span style={{ float: 'right' }}>
                        {this.state.editMode ?
                        <div>
                            {this.props.isCurrentUser ? null : <Button name='delete' icon='small-cross' small={true} intent='danger' minimal={true} onClick={this.handleDeleteButton} />}
                            <Button name='save' icon='tick' small={true} intent='success' minimal={true} onClick={this.handleSave} />
                        </div> :
                        <Button name='edit' icon='edit' small={true} minimal={true} onClick={this.handleEdit} />}
                    </span>
                </h3>
                <div style={{ padding: '5px 0' }}><EditableText defaultValue={this.props.email} disabled={!this.state.editMode} onChange={this.handleEmailChange} /></div>
                <UserClassSelector
                    disabled={this.props.isCurrentUser}
                    user_id={this.props.user_id}
                    user_class={this.props.user_class} />
            </Card>
        );
    }

    private handleNameChange(text: any) {
        console.log(text);
    }

    private handleEmailChange(text: any) {
        console.log(text);
    }

    private handleCancel() {
        this.setState((prevState) => {
            return {
                ...prevState,
                deleteOpen: false,
            }
        });
    }

    private handleDeleteButton() {
        this.setState((prevState) => {
            return {
                ...prevState,
                deleteOpen: true,
            }
        });
    }

    private handleDelete() {
        console.log("OH NO");
    }

    private handleEdit() {
        this.setState((prevState) => {
            return {
                ...prevState,
                editMode: true,
            }
        });
    }

    private handleSave() {
        this.setState((prevState) => {
            return {
                ...prevState,
                editMode: false,
            }
        });
    }
};

export default AdminPanelUserCard;
