import React from 'react';
import User, { roleStringToEnum } from '../../types/User';
import axios from 'axios';
import { Card, Button, Icon } from 'semantic-ui-react';
import UserCard from './UserCard';
import { UserState } from '../../state/UserManagement';

interface PageAdminUsersProps {
    account: User;
    users: UserState;
    addUser: (user: User) => void;
    deleteUser: (userID: number) => void;
    updateUser: (user: User) => void;
    fillUsers: (users: User[]) => void;
}

interface RawUsersResponse {
    id: number,
    name: string,
    email: string,
    role: string,
    tags: string,
}

const PageAdminUsers: React.FC<PageAdminUsersProps> = (props) => {
    const fillUsers = props.fillUsers;
    React.useEffect(() => {
        const downloadUsers = async () => {
            const result = await axios.get('/api/users');

            // TODO validation checks.
            const rawUsers: RawUsersResponse[] = result.data.users;

            const validatedUsers = rawUsers.map((value: RawUsersResponse) => {
                return {
                    id: value.id,
                    name: value.name,
                    email: value.email,
                    role: roleStringToEnum(value.role),
                    tags: value.tags ? value.tags.split(',') : [],
                };
            });

            fillUsers(validatedUsers);
        };

        downloadUsers();
    }, [fillUsers]);

    return (
        <div>
            <div style={{ paddingBottom: 15 }}>
                <h1 style={{ display: 'inline'}}>User Management</h1>
                <span style={{float: 'right'}}>
                    <Button animated='fade' color='blue'>
                        <Button.Content visible>New User</Button.Content>
                        <Button.Content hidden><Icon name='plus' /></Button.Content>
                    </Button>
                </span>
            </div>
            <Card.Group centered>
                {Object.values(props.users).length > 0
                    ? Object.values(props.users).map((user) => {
                        return (
                            <UserCard
                                key={user.id}
                                account={props.account}
                                user={user}
                                updateUser={props.updateUser} />
                        );
                    })
                    : null
                }
            </Card.Group>
        </div>
    );
}

export default PageAdminUsers;
