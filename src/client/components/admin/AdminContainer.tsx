import * as React from 'react';
import { Switch, Route, match } from 'react-router-dom';
import Admin from './Admin';
import Ranking from './Ranking';
import Events from './Events';
import Projects from './Projects';
import Users from './Users';
import Header from '../Header';
import Navigation from '../Navigation';
import SidebarNavigation from './SidebarNavigation';
import './AdminContainer.scss';

interface AdminContainerProps {
    match: any;
}

const AdminContainer: React.SFC<AdminContainerProps> = (props) => {
    return (
        <div className='admin-container'>
            <div className='admin-left'>
                <SidebarNavigation
                    match={props.match}
                    linkNames={[
                        'Home', 'Ranking', 'Events', 'Projects', 'Users',
                    ]}
                    linkDests={[
                        '', '/ranking', '/events', '/projects', '/users',
                    ]}/>
            </div>
            <div className='admin-right'>
            <Switch>
                <Route path={`${props.match.url}/ranking`}
                    component={Ranking} />
                <Route path={`${props.match.url}/events`}
                    component={Events} />
                <Route path={`${props.match.url}/projects`}
                    component={Projects} />
                <Route path={`${props.match.url}/users`}
                    component={Users} />
                <Route path={`${props.match.url}`}
                    component={Admin} />
            </Switch>
            </div>
        </div>
    );
};

export default AdminContainer;
