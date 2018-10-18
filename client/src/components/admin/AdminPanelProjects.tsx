import * as React from 'react';
import * as papa from 'papaparse';
import { ProjectState, CategoryState } from '../../types/State';
import ProjectsTable from '../expo/ProjectsTable';
import AdminPanelProjectsTable from './AdminPanelProjectsTable';
import { Button, Dialog, Classes, Spinner, H6, FileInput } from '@blueprintjs/core';
import AdminPanelUploadProjects from './AdminPanelUploadProjects';
import { AppToaster } from '../../util/AppToaster';
// import './Projects.css';

interface AdminPanelProjectsProps {
    categories: CategoryState[];
    projects: ProjectState[];
    refreshProjects: (projects: ProjectState[]) => void;
}

interface AdminPanelProjectsState {
    isLoading: boolean;
    uploadDialogOpen: boolean;
}

const SPINNER_SIZE = 100;

class AdminPanelProjects extends React.Component<AdminPanelProjectsProps, AdminPanelProjectsState> {
    constructor(props: AdminPanelProjectsProps) {
        super(props);

        this.state = {
            isLoading: true,
            uploadDialogOpen: false,
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.openUploadDialog = this.openUploadDialog.bind(this);
        this.closeUploadDialog = this.closeUploadDialog.bind(this);
        this.handleRefreshProjects = this.handleRefreshProjects.bind(this);
    }

    public async componentDidMount() {
        this.fetchProjects();
    }

    public render() {
        if (this.state.isLoading) {
            return (
                <div style={{
                    width: '100%',
                }}>
                    <div style={{
                        width: SPINNER_SIZE,
                        margin: '20px auto',
                    }}>
                        <Spinner size={SPINNER_SIZE} />
                    </div>
                    <H6 style={{
                        textAlign: 'center',
                    }}>
                        Loading projects
                    </H6>
                </div>
            )
        }

        return (
            <div>
                <Dialog
                    isOpen={this.state.uploadDialogOpen}
                    canEscapeKeyClose={true}
                    canOutsideClickClose={true}
                    title='Upload Projects'
                    onClose={this.closeUploadDialog}>

                    <div className={Classes.DIALOG_BODY}>
                        <AdminPanelUploadProjects refreshProjects={this.handleRefreshProjects} />
                    </div>

                </Dialog>
                <h1>
                    Projects
                    <span style={{
                        float: 'right',
                    }}>
                        <Button name='refresh' icon='refresh' large={true} intent='primary' minimal={true} onClick={this.handleRefresh} />
                        <Button name='upload' icon='upload' large={true} intent='primary' minimal={true} onClick={this.openUploadDialog} />
                    </span>
                </h1>
                {
                    this.props.projects ?
                    <ProjectsTable projects={this.props.projects} currentCategory='All' />
                    : undefined
                }
            </div>
        );
    }

    private handleRefreshProjects(projects: ProjectState[]) {
        this.setState((prevState) => {
            return {
                ...prevState,
                uploadDialogOpen: false,
            };
        }, () => {
            this.props.refreshProjects(projects);
        });
    }

    private async fetchProjects() {
        const result = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                    project {
                        project_id
                        devpost_id
                        name
                        table_number
                        expo_number
                        sponsor_prizes
                        categories {
                            category_id
                        }
                    }
                }`
            }),
        });

        const json = await result.json();

        const categories = {};
        const newProjects = json.data.project.map((project: any) => {
            const newProject = project;
            const sponsorPrizes = project.sponsor_prizes.split(',').map((sponsorPrize: string) => {
                const finalPrizeName = sponsorPrize.trim();

                if (finalPrizeName) {
                    categories[finalPrizeName] = true;
                }

                return finalPrizeName;
            });

            if (sponsorPrizes[0]) {
                newProject.sponsor_prizes = sponsorPrizes;
            } else {
                newProject.sponsor_prizes = [];
            }

            return newProject;
        });

        this.props.refreshProjects(newProjects);

        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: false,
            };
        });
    }

    private handleRefresh() {
        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: true,
            };
        }, () => {
            this.fetchProjects();
        });
    }

    private openUploadDialog() {
        let hasPrimary = false;
        for (const category of this.props.categories) {
            if (category.is_primary) {
                hasPrimary = true;
            }
        }

        if (hasPrimary) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    uploadDialogOpen: true,
                };
            });
        } else {
            AppToaster.show({
                message: 'There must be at least 1 primary category.',
                intent: 'danger',
            });
        }
    }

    private closeUploadDialog() {
        this.setState((prevState) => {
            return {
                ...prevState,
                uploadDialogOpen: false,
            };
        });
    }
};

export default AdminPanelProjects;
