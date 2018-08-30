import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../Header';
import Navigation from '../Navigation';
import AdminContainer from './AdminContainer';
import AdminNavigation from './SidebarNavigation';
import Status from '../Status';
import Judging from '../judging/Judging';
import ExpoPage from '../expo/ExpoPage';

interface AdminPageProps {}

const AdminPage: React.SFC<AdminPageProps> = (props) => {
    return (
        <div style={{
            width: '100%',
            maxWidth: 960,
            margin: '0 auto',
        }}>
            <Navigation
                linkNames={['Home', 'Judging', 'Expo', 'Admin']}
                linkDests={['/', '/judging', '/expo', '/admin']} />
            <div style={{
                padding: 15,
            }}>
                <Switch>
                    <Route exact path='/judging' component={Judging} />
                    <Route exact path='/expo' component={ExpoPage} />
                    <Route path='/admin' component={AdminContainer} />
                    <Route exact path='/' component={Status} />
                </Switch>
            </div>
        </div>
    );
};

export default AdminPage;
