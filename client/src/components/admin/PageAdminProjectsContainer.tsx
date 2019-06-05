import { AppState } from '../../state/Store';
import PageAdminProjects from './PageAdminProjects';
import { connect } from 'react-redux';
import Project from '../../types/Project';
import { ProjectState, updateProject, deleteProject, fillProjects, appendFillProjects } from '../../state/Project';

const mapStateToProps = (state: AppState) => {
    return {
        projects: state.projects,
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateProject: (project: Project) => {
            dispatch(updateProject(project));
        },
        deleteProject: (projectID: number) => {
            dispatch(deleteProject(projectID));
        },
        fillProjects: (projects: ProjectState) => {
            dispatch(fillProjects(projects));
        },
        appendFillProjects: (projects: ProjectState) => {
            dispatch(appendFillProjects(projects));
        },
    };
}

const PageAdminCategoriesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageAdminProjects);

export default PageAdminCategoriesContainer;
