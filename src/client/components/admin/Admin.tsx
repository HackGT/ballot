import * as React from 'react';
// import './Admin.scss';

interface AdminProps {}

const Admin: React.SFC<AdminProps> = (props) => {
    return (
        <div>
            <h1>Welcome!</h1>
            <p>You are an admin.</p>
        </div>
    );
};

export default Admin;
