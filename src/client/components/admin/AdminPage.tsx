import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../Header';
import Navigation from '../Navigation';
import AdminContainer from './AdminContainer';
import AdminNavigation from './SidebarNavigation';
import Status from '../Status';
import Judging from '../judging/Judging';
import Expo from '../expo/Expo';
// import './AdminPage.scss';

interface AdminPageProps {
    match: string;
}

const AdminPage: React.SFC<AdminPageProps> = (props) => {
    return (
        <div>
            <Header />
            <Navigation
                linkNames={['Home', 'Judging', 'Expo', 'Admin']}
                linkDests={['/', '/judging', '/expo', '/admin']} />
            <Switch>
                <Route exact path='/judging' component={Judging} />
                <Route exact path='/expo' component={Expo} />
                <Route path='/admin' component={AdminContainer} />
                <Route exact path='/' component={Status} />
            </Switch>
        </div>
    );
};

export default AdminPage;
