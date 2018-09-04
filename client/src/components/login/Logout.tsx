import * as React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import FetcherContainer from '../../containers/FetcherContainer';
import { UpdateClassRequestType } from '../../types/UpdateClass';

interface LogoutProps {
    updateClass: (json: UpdateClassRequestType) => void;
}

interface LogoutState {
    success: boolean;
}

class Logout extends React.Component<LogoutProps, LogoutState> {
    constructor(props: LogoutProps) {
        super(props);

        this.state = {
            success: false,
        };
    }

    public async componentDidMount() {
        await axios.get('/auth/logout');
        this.setState((prevState) => {
            return {
                ...prevState,
                success: true,
            }
        }, () => {
            this.props.updateClass({
                name: null,
                email: null,
                class: null,
            });
        });
    }

    public render() {
        return (
            this.state.success ? <Redirect to='/' /> : <div>Logging out...</div>
        )
    }
}

export default Logout;
