import Project from '../types/Project';

export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const FILL_PROJECTS = 'FILL_PROJECTS';
export const APPEND_FILL_PROJECTS = 'APPEND_FILL_PROJECTS';

export interface ProjectState {
    [ id: number ]: Project;
}

export function updateProject(project: Project) {
    return { type: UPDATE_PROJECT, project };
}

export function deleteProject(projectID: number) {
    return { type: DELETE_PROJECT, projectID };
}

export function fillProjects(projects: ProjectState) {
    return { type: FILL_PROJECTS, projects };
}

export function appendFillProjects(projects: ProjectState) {
    return { type: APPEND_FILL_PROJECTS, projects };
}

export default function projects(state: ProjectState = {}, action: any) {
    switch (action.type) {
        case UPDATE_PROJECT:
            return {
                ...state,
                [action.project.id]: action.project,
            };
        case DELETE_PROJECT:
            let {[action.projectID]: omit, ...res} = state;
            return res;
        case FILL_PROJECTS:
            return action.projects;
        case APPEND_FILL_PROJECTS:
            return {
                ...state,
                ...action.projects,
            }
        default:
            return state;
    }
}
