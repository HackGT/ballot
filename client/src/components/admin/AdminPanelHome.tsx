import * as React from 'react';
// import './Admin.css';

interface AdminPanelHomeProps {}

const AdminPanelHome: React.SFC<AdminPanelHomeProps> = (props) => {
    return (
        <div>
            <h1>Administration Home</h1>
            <p>This is the administration panel</p>
        </div>
    );
};

export default AdminPanelHome;
