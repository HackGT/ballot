import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Admin from './admin/Admin';
import Ranking from './admin/Ranking';
import Events from './admin/Events';
import Projects from './admin/Projects';
import Users from './admin/Users';
import Header from './Header';
import Navigation from './Navigation';
import AdminNavigation from './admin/SidebarNavigation';
import './AdminPage.scss';

interface AdminPageProps {}

const AdminPage: React.SFC<AdminPageProps> = (props) => {
    return (
        <div>
            <Header />
            <Navigation linkNames={[]} linkDests={[]}/>
            <div className='admin-container'>
                <div className='admin-left'>
                    <AdminNavigation linkNames={['Home', 'Ranking', 'Events', 'Projects', 'Users']} linkDests={['/', '/ranking', '/events', '/projects', '/users']}/>
                </div>
                <div className='admin-right'>
                    <Route exact path='/' component={Admin} />
                    <Route exact path='/ranking' component={Ranking} />
                    <Route exact path='/events' component={Events} />
                    <Route exact path='/projects' component={Projects} />
                    <Route exact path='/users' component={Users} />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
