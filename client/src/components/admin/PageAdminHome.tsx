import React from 'react';
import { Route, Switch } from 'react-router';
import PageAdminProjectsContainer from './PageAdminProjectsContainer';
import PageAdminUsersContainer from './PageAdminUsersContainer';
import PageAdminEpicenter from './PageAdminEpicenter';
import PageAdminCategoriesContainer from './PageAdminCategoriesContainer';
import AdminNavigation from './AdminNavigation';

interface PageAdminHomeProps {
    // account: User;
}

const PageAdminHome: React.FC<PageAdminHomeProps> = (props) => {
    const adminRoute = '/admin';
    return (
        <div>
            <AdminNavigation />
            <Switch>
                <Route path={`${adminRoute}/projects`} component={PageAdminProjectsContainer} />
                <Route path={`${adminRoute}/categories`} component={PageAdminCategoriesContainer} />
                <Route path={`${adminRoute}/users`} component={PageAdminUsersContainer} />
                <Route path={`${adminRoute}`} component={PageAdminEpicenter} />
            </Switch>
        </div>
    )
}

export default PageAdminHome;
