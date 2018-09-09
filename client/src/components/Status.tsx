import * as React from 'react';
import { H1, H2, H4 } from '@blueprintjs/core';
import { AuthState } from '../types/State';

interface StatusProps {
    auth: AuthState
}

const Status: React.SFC<StatusProps> = (props) => {
    return (
        <div style={{
            maxWidth: 640,
            margin: '0 auto',
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '20px',
            }}>
                <h3>Hello {props.auth.name}!</h3>
                <H1>Welcome to Ballot!</H1>
                <p><strong>Your Status: {props.auth.role}</strong></p>
            </div>


            <p>If you go to the <strong>Expo</strong> page, you can see all the projects that were made during the event along with their locations during the Expo and links to their DevPost pages.</p>
            {props.auth.role === 'Judge' || props.auth.role === 'Owner' || props.auth.role === 'Admin' ?
                <p>Once the expo starts, you can go over to the <strong>Judging</strong> page to get your next project. All the instructions you need will be on that page. </p> : null}
        </div>
    );
};

export default Status;
