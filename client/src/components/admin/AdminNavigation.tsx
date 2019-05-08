import React from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter } from 'react-router';

interface AdminNavigationProps {
    history: any;
    location: any;
    match: any;
}

const AdminNavigation: React.FC<AdminNavigationProps> = (props) => {
    const navTo = (link: string) => {
        props.history.push(link);
    }

    return (
        <Menu pointing secondary>
            <Menu.Item
                active={props.location.pathname === '/admin'}
                onClick={() => navTo('/admin')}>Epicenter</Menu.Item>
            <Menu.Item
                active={props.location.pathname.startsWith('/admin/projects')}
                onClick={() => navTo('/admin/projects')}>Projects</Menu.Item>
            <Menu.Item
                active={props.location.pathname.startsWith('/admin/categories')}
                onClick={() => navTo('/admin/categories')}>Categories</Menu.Item>
            <Menu.Item
                active={props.location.pathname.startsWith('/admin/users')}
                onClick={() => navTo('/admin/users')}>Users</Menu.Item>
        </Menu>
    );
}

export default withRouter(AdminNavigation);
