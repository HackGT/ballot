import { connect, Dispatch } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../../util/authorization';

import Expo from '../../components/expo/Expo';
import { refreshProjects } from '../../actions/projects'

import { State, ProjectState } from '../../types/State';
import Projects from '../../components/admin/Projects';

interface StateToProps {
    projects: ProjectState[];
}

interface DispatchToProps {
    refreshProjects: (proejcts: ProjectState[]) => void;
}

const mapStateToProps = (state: State): StateToProps => {
    return {
        projects: state.projects,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
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
)(Projects);

