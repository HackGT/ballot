import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { ProjectState, fillProjects } from '../../state/Project';
import ProjectEditor from './ProjectEditor';
import ProjectUploader from './ProjectUploader';
import Project from '../../types/Project';
import axios from 'axios';

interface PageAdminProjectsProps {
    projects: ProjectState;
    updateProject: (project: Project) => void;
    deleteProject: (projectID: number) => void;
    fillProjects: (projects: ProjectState) => void;
    appendFillProjects: (projects: ProjectState) => void;
}

const initialProject = {
    name: '',
    devpostURL: '',
    expoNumber: 1,
    tableGroup: '',
    tableNumber: 1,
    sponsorPrizes: '',
    tags: '',
}

const PageAdminProjects: React.FC<PageAdminProjectsProps> = (props) => {
    const [projectModalOpen, changeProjectModalOpen] = React.useState(false);
    const [uploadModalOpen, changeUploadModalOpen] = React.useState(false);
    const [modalProject, changeModalProject] = React.useState<Project>(initialProject);

    const openProjectModal = (project: Project) => {
        changeModalProject(project);
        changeProjectModalOpen(true);
    };

    const openUploadModal = () => {
        changeUploadModalOpen(true);
    };

    const closeModal = () => {
        changeProjectModalOpen(false);
        changeUploadModalOpen(false);
    };

    React.useEffect(() => {
        const fetchProjects = async () => {
            const result = await axios.get('/api/projects');

            fillProjects(result.data);
        };

        fetchProjects();
    }, [props.fillProjects]);

    return (
        <div>
            <div style={{ paddingBottom: 15 }}>
                <h1 style={{ display: 'inline'}}>Projects</h1>
                <span style={{float: 'right'}}>
                    <Button animated='fade' onClick={openUploadModal}>
                        <Button.Content visible>Upload CSV</Button.Content>
                        <Button.Content hidden><Icon name='upload' /></Button.Content>
                    </Button>
                    <Button animated='fade' color='blue' onClick={() => openProjectModal(initialProject)}>
                        <Button.Content visible>Add Project</Button.Content>
                        <Button.Content hidden><Icon name='plus' /></Button.Content>
                    </Button>
                </span>
            </div>
            <ProjectEditor
                open={projectModalOpen}
                project={modalProject}
                closeModal={closeModal}
                updateProject={props.updateProject}
            />
            <ProjectUploader
                open={uploadModalOpen}
                closeModal={closeModal}
                fillProjects={props.fillProjects}
                appendFillProjects={props.appendFillProjects} />
        </div>
    );
}

export default PageAdminProjects;
