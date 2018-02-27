import * as React from 'react';
// import './Owner.scss';

interface OwnerProps {}

const Owner: React.SFC<OwnerProps> = (props) => {
    return (
        <div id='register-form'>
            <h1>Welcome!</h1>
            <p>You have been approved as a Owner!</p>
        </div>
    );
};

export default Owner;
