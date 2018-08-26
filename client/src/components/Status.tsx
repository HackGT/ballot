import * as React from 'react';
// import './Status.css';

interface StatusProps {}

const Status: React.SFC<StatusProps> = (props) => {
    return (
        <div>
            <h1>Welcome!</h1>
            <p>You are a something...</p>
        </div>
    );
};

export default Status;
