import * as React from 'react';
// import './Owner.css';

interface OwnerProps {}

const Owner: React.SFC<OwnerProps> = (props) => {
    return (
        <div>
            <h1>Welcome!</h1>
            <p>You have been approved as a Owner!</p>
        </div>
    );
};

export default Owner;
