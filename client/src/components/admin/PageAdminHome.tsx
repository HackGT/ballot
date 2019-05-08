import React from 'react';
import { Route, Switch } from 'react-router';
import PageAdminProjects from './PageAdminProjects';
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
                <Route path={`${adminRoute}/projects`} component={PageAdminProjects} />
                <Route path={`${adminRoute}/categories`} component={PageAdminCategoriesContainer} />
                <Route path={`${adminRoute}/users`} component={PageAdminUsersContainer} />
                <Route path={`${adminRoute}`} component={PageAdminEpicenter} />
            </Switch>
        </div>
    )
}

export default PageAdminHome;
