import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../Header';
import Navigation from '../Navigation';
import AdminPanelWrapper from './AdminPanelWrapper';
import AdminNavigation from './SidebarNavigation';
import Judging from '../judging/Judging';
import StatusContainer from '../../containers/StatusContainer';
import { ExpoContainer } from '../../containers/expo/ExpoContainer';

interface AdminWrapperProps {}

const AdminWrapper: React.SFC<AdminWrapperProps> = (props) => {
    return (
        <div style={{
            width: '100%',
            maxWidth: 960,
            margin: '0 auto',
        }}>
            <Navigation
                hasSession={true}
                linkNames={['Home', 'Judging', 'Expo', 'Admin']}
                linkDests={['/', '/judging', '/expo', '/admin']} />
            <div style={{
                padding: 15,
            }}>
                <Switch>
                    <Route exact path='/judging' component={Judging} />
                    <Route exact path='/expo' component={ExpoContainer} />
                    <Route path='/admin' component={AdminPanelWrapper} />
                    <Route exact path='/' component={StatusContainer} />
                </Switch>
            </div>
        </div>
    );
};

export default AdminWrapper;
