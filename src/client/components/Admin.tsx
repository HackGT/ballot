import * as React from 'react';
// import './Admin.scss';

interface AdminProps {}

const Admin: React.SFC<AdminProps> = (props) => {
    return (
        <div id='register-form'>
            <h1>Welcome!</h1>
            <p>You have been approved as a admin!</p>
        </div>
    );
};

export default Admin;
