import * as React from 'react';
import axios from 'axios';
import UserClassSelector from './UserClassSelector';
import { UserState } from '../../types/State';
import { Card, Button, EditableText, Popover, Alert, Dialog, Classes, InputGroup } from '@blueprintjs/core';

export interface AdminPanelUserCardProps {
    user_id: number;
    name: string;
    email: string;
    user_class: string;
    isCurrentUser: boolean;
    editUser: (user: UserState) => void;
    removeUser: (user: UserState) => void;
}

export interface AdminPanelUserCardState {
    name: string;
    editMode: boolean;
    deleteOpen: boolean;
    passwordDialog: boolean;
    password: string;
    passwordConfirm: string;
    passwordChanging: boolean;
}

class AdminPanelUserCard extends React.Component<AdminPanelUserCardProps, AdminPanelUserCardState> {
    constructor(props: AdminPanelUserCardProps) {
        super(props);

        this.state = {
            name: props.name,
            editMode: false,
            deleteOpen: false,
            passwordDialog: false,
            password: '',
            passwordConfirm: '',
            passwordChanging: false,
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.handleNameChange = this.handleNameChange.bind(this);

        this.closePasswordDialog = this.closePasswordDialog.bind(this);
        this.openPasswordDialog = this.openPasswordDialog.bind(this);

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.submitChangePassword = this.submitChangePassword.bind(this);
    }

    public render() {
        return (
            <Card style={{
                margin: 10,
                width: 270,
            }}>
                <Dialog
                    isOpen={this.state.passwordDialog}
                    canEscapeKeyClose={true}
                    canOutsideClickClose={true}
                    title='Change Password'
                    onClose={this.closePasswordDialog}>

                    <div className={Classes.DIALOG_BODY}>
                        <InputGroup
                            name='password'
                            type='password'
                            disabled={this.state.passwordChanging}
                            placeholder='New Password'
                            onChange={this.handlePasswordChange} />

                        <InputGroup
                            name='passwordConfirm'
                            type='password'
                            disabled={this.state.passwordChanging}
                            placeholder='New Password (confirm)'
                            onChange={this.handlePasswordChange} />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                text='Cancel'
                                disabled={this.state.passwordChanging}
                                onClick={this.closePasswordDialog} />
                            <Button
                                text='Reset Password'
                                intent='danger'
                                loading={this.state.passwordChanging}
                                onClick={this.submitChangePassword} />
                        </div>
                    </div>

                </Dialog>
                <Alert
                    isOpen={this.state.deleteOpen}
                    cancelButtonText='Cancel'
                    confirmButtonText='Delete'
                    canOutsideClickCancel={true}
                    canEscapeKeyCancel={true}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleDelete}
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
                <div style={{ padding: '5px 0' }}><p>{this.props.email}</p></div>
                {this.state.editMode ?
                    <div>
                        <UserClassSelector
                            disabled={this.props.isCurrentUser}
                            user_id={this.props.user_id}
                            user_class={this.props.user_class} />
                        <Button
                            style={{
                                marginTop: 10,
                            }}
                            text='Reset Password'
                            intent='danger'
                            onClick={this.openPasswordDialog}
                            small={true} />
                    </div> :
                    <div>{this.props.user_class}</div>
                }
            </Card>
        );
    }

    private submitChangePassword() {
        if (this.state.password === this.state.passwordConfirm) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    passwordChanging: true,
                };
            }, async () => {
                const changePasswordResult = await fetch('/graphql', {
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            mutation {
                                changePassword(
                                    id: ${this.props.user_id}
                                    newPassword: "${this.state.password}"
                                ) {
                                    user_id
                                }
                            }
                        `
                    }),
                });

                const changePasswordResultJSON = await changePasswordResult.json();

                console.log(changePasswordResultJSON);

                if (changePasswordResultJSON.data.changePassword.user_id === this.props.user_id) {
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            passwordChanging: false,
                            passwordDialog: false,
                        };
                    });
                }
            });
        }
    }

    private handlePasswordChange(event: any) {
        const target = event.target;
        this.setState((prevState) => {
            return {
                ...prevState,
                [target.name]: target.value,
            };
        });
    }

    private closePasswordDialog() {
        this.setState((prevState) => {
            return {
                ...prevState,
                passwordDialog: false,
            };
        });
    }

    private openPasswordDialog() {
        this.setState((prevState) => {
            return {
                ...prevState,
                passwordDialog: true,
            };
        });
    }

    private handleNameChange(text: any) {
        this.setState((prevState) => {
            return {
                ...prevState,
                name: text,
            };
        });
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

    private async handleDelete() {
        console.log('kljdsflkj');

        this.setState((prevState) => {
            return {
                ...prevState,
                deleteOpen: false,
            }
        });
    }

    private handleEdit() {
        this.setState((prevState) => {
            return {
                ...prevState,
                editMode: true,
            }
        });
    }

    private async handleSave() {
        if (this.state.name !== this.props.name) {
            const deleteResult = await fetch('/graphql', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        mutation {
                            changeName(
                                id: ${this.props.user_id}
                                newName: "${this.state.name}"
                            ) {
                                user_id
                            }
                        }
                    `
                }),
            });

            if (deleteResult.ok) {
                this.props.editUser({
                    name: this.state.name,
                    email: this.props.email,
                    user_id: this.props.user_id,
                    user_class: this.props.user_class,
                });
            }
        }

        this.setState((prevState) => {
            return {
                ...prevState,
                editMode: false,
            }
        });
    }
};

export default AdminPanelUserCard;
