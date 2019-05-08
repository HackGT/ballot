import React from 'react';
import User, { getRoleName, UserRole } from '../../types/User';
import axios from 'axios';
import { Card, Input, Button, Dimmer, Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router';

interface UserCardProps {
    account: User;
    user: User;
    updateUser: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = (props) => {
    const [edit, changeEdit] = React.useState(false);
    const [processing, changeProcessing] = React.useState(false);
    const [tempUser, changeTempUser] = React.useState<User>(props.user);
    const [password, changePassword] = React.useState('');

    const handleSave = async () => {
        console.log(tempUser);
        changeProcessing(true);
        await props.updateUser({
            ...props.user,
            name: tempUser.name,
            role: tempUser.role,
        });

        console.log(props.user);

        try {
            await axios.post('/api/users', {
                'id': tempUser.id,
                'name': tempUser.name,
                'role': getRoleName(tempUser.role),
            });

            changeEdit(false);
            changeProcessing(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDiscard = () => {
        changeTempUser(props.user);
        changeEdit(false);
    }

    const generateRoleChanger = () => {
        const buttons = [];
        switch (props.account.role) {
            case UserRole.Owner:
                buttons.push(<Button
                    key={'owner'}
                    disabled={props.account.id === props.user.id}
                    onClick={() => changeTempUser({
                        ...tempUser,
                        role: UserRole.Owner,
                    })}
                    active={tempUser.role === UserRole.Owner}>Owner</Button>
                );
                buttons.push(<Button
                    key={'admin'}
                    disabled={props.account.id === props.user.id}
                    onClick={() => changeTempUser({
                        ...tempUser,
                        role: UserRole.Admin,
                    })}
                    active={tempUser.role === UserRole.Admin}>Admin</Button>
                );
            case UserRole.Admin:
                buttons.push(<Button
                    key={'judge'}
                    disabled={props.account.id === props.user.id || props.account.role <= props.user.role}
                    onClick={() => changeTempUser({
                        ...tempUser,
                        role: UserRole.Judge,
                    })}
                    active={tempUser.role === UserRole.Judge}>Judge</Button>
                );
                buttons.push(<Button
                    key={'pending'}
                    disabled={props.account.id === props.user.id || props.account.role <= props.user.role}
                    onClick={() => changeTempUser({
                        ...tempUser,
                        role: UserRole.Pending,
                    })}
                    active={tempUser.role === UserRole.Pending}>Pending</Button>
                );
                break;
            case UserRole.Judge:
            case UserRole.Pending:
            default:
                return <Redirect to='/' />
        }

        return buttons;
    }

    if (edit) {
        if (processing) {
            return (
                <Card>
                    <Dimmer active inverted>
                        <Loader />
                    </Dimmer>
                </Card>
            )
        }

        return (
            <Card>
                <Card.Header>
                    <Input
                        fluid
                        label={tempUser.id}
                        size='large'
                        onChange={(event) => changeTempUser({
                            ...tempUser,
                            name: event.target.value})}
                        value={tempUser.name} />
                </Card.Header>
                <Card.Content>
                    <Card.Meta>{tempUser.email}</Card.Meta>
                </Card.Content>
                <Card.Content>
                    <Button.Group size='mini' fluid compact>
                        {generateRoleChanger()}
                    </Button.Group>
                    <Button fluid color='red' compact size='mini' disabled={props.account.id === props.user.id || props.account.role <= props.user.role}>Reset Password</Button>
                </Card.Content>
                <Card.Content extra>
                    <Button.Group size='small' fluid compact>
                        <Button
                            basic
                            onClick={handleSave}
                            color='green'>Save</Button>
                        <Button
                            basic
                            onClick={handleDiscard}
                            color='yellow'>Discard</Button>
                        <Button
                            basic
                            color='red'>Delete</Button>
                    </Button.Group>
                </Card.Content>
            </Card>
        )
    } else {
        return (
            <Card
                onClick={() => changeEdit(true)}
                header={`${props.user.id}: ${props.user.name}`}
                meta={props.user.email}
                description={getRoleName(props.user.role)} />
        );
    }
}

export default UserCard;
