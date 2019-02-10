import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../../util/authorization';

import Expo from '../../components/expo/Expo';
import { refreshProjects } from '../../actions/projects';

import { State, ProjectState, CategoryState } from '../../types/State';
import AdminPanelProjects from '../../components/admin/AdminPanelProjects';

interface StateToProps {
    projects: ProjectState[];
    categories: CategoryState[];
}

interface DispatchToProps {
    refreshProjects: (projects: ProjectState[]) => void;
}

const mapStateToProps = (state: State): StateToProps => {
    return {
        projects: state.projects,
        categories: state.categories,
    };
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        refreshProjects: (projects: ProjectState[]) => {
            dispatch(refreshProjects(projects));
        },
    };
};

export const ExpoContainer = connect<StateToProps, DispatchToProps>(
    mapStateToProps,
    mapDispatchToProps
)(Expo);

export const ProjectsContainer = connect<StateToProps, DispatchToProps>(
    mapStateToProps,
    mapDispatchToProps
)(AdminPanelProjects);

