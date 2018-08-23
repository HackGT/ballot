import {
    REFRESH_PROJECTS,
    RefreshProjectsAction,
} from '../actions/projects';

import Action from '../types/Action';
import { ProjectState } from '../types/State';

const projects = (
    state: ProjectState[] = [],
    actionAny: Action
): ProjectState[] => {
    switch (actionAny.type) {
        case REFRESH_PROJECTS:
            const actionUpdateProjects = actionAny as RefreshProjectsAction;
            return actionUpdateProjects.projects;
        default:
            return state;
    }
};

export default projects;
