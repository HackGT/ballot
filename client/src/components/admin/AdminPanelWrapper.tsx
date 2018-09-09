import * as React from 'react';
import { Switch, Route, match } from 'react-router-dom';
import AdminPanelHome from './AdminPanelHome';
import AdminPanelRanking from './AdminPanelRanking';
import Events from './AdminPanelCategories';
import Users from './AdminPanelUsers';
import Navigation from '../Navigation';
import SidebarNavigation from './SidebarNavigation';
import { ProjectsContainer } from '../../containers/expo/ExpoContainer';
import { Tabs, Tab } from '@blueprintjs/core';
import AdminPanelCategories from './AdminPanelCategories';
import AdminPanelUsers from './AdminPanelUsers';
import MediaQuery from 'react-responsive';
import CategoriesContainer from '../../containers/admin/CategoriesContainer';
import { AdminPanelUsersContainer } from '../../containers/StatusContainer';

interface AdminPanelWrapperProps {
    match: any;
}

interface AdminPanelWrapperState {
    selectedTab: string;
}

class AdminPanelWrapper extends React.Component<AdminPanelWrapperProps, AdminPanelWrapperState> {
    constructor(props: AdminPanelWrapperProps) {
        super(props);

        this.state = {
            selectedTab: 'projects',
        };

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    public render() {
        return (
            <Tabs id="TabsExample" onChange={this.handleTabChange} selectedTabId={this.state.selectedTab}>
                <Tab id='projects' title="Projects" panel={<ProjectsContainer />} />
                <Tab id='categories' title="Categories" panel={<CategoriesContainer />} />
                <Tab id='ranking' title="Ranking" panel={<AdminPanelRanking />} />
                <Tab id='users' title="Users" panel={<AdminPanelUsersContainer />} />
            </Tabs>
        );
    }

    private handleTabChange(event: any) {
        this.setState((prevState) => {
            return {
                ...prevState,
                selectedTab: event,
            };
        });
    }
};

export default AdminPanelWrapper;
