import { Dispatch } from 'redux';
import { ProjectState } from '../types/State';
import Action from '../types/Action';

export const REFRESH_PROJECTS = 'REFRESH_PROJECTS';

export interface RefreshProjectsAction extends Action {
    projects: ProjectState[];
}

export const refreshProjects: (projects: ProjectState[])
    => RefreshProjectsAction = (projects: ProjectState[]) => {
    return {
        type: REFRESH_PROJECTS,
        projects,
    };
};
