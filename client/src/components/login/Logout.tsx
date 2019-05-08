import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import User from '../../types/User';
import { Dimmer, Loader } from 'semantic-ui-react';

interface LogoutProps {
    account: User;
    logoutUser: () => void;
}

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Logout: React.FC<LogoutProps> = (props) => {
    const [success, changeSuccess] = React.useState(false);
    React.useEffect(() => {
        const logout = async () => {
            await Promise.all([axios.get('/auth/logout'), sleep(500)])
            props.logoutUser();
            changeSuccess(true);
        }

        logout();
    }, [success, props]);

    return (success
        ? <Redirect to='/' />
        :   <Dimmer active inverted>
                <Loader size='huge'>Logging Out...</Loader>
            </Dimmer>
    );
}

export default Logout;
