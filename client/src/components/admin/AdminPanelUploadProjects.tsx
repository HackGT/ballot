import * as React from 'react';
import * as papa from 'papaparse';
import { ProjectState } from '../../types/State';
import { FileInput, Button, NumericInput, H4, FormGroup } from '@blueprintjs/core';
import AdminPanelUploadProjectsGroup from './AdminPanelUploadProjectsGroup';
import { AppToaster } from '../../util/AppToaster';

interface ProjectGroup {
    name: string;
    numberProjects: number;
}

interface AdminPanelUploadProjectsProps {
    refreshProjects: (projects: ProjectState[]) => void;
}

interface AdminPanelUploadProjectsState {
    uploadFileName: string;
    csv: File | undefined;
    projects: ProjectState[];
    expoCount: number;
    projectGroups: ProjectGroup[];
    projectsAccountedFor: number;
    totalProjects: number;
    errorMessage: string;
}

const initGroup = {
    name: '',
    numberProjects: 30,
};

class AdminPanelUploadProjects extends React.Component<AdminPanelUploadProjectsProps, AdminPanelUploadProjectsState> {
    constructor(props: AdminPanelUploadProjectsProps) {
        super(props);

        this.state = {
            uploadFileName: 'Click to upload...',
            csv: undefined,
            projects: [],
            expoCount: 1,
            projectGroups: [initGroup],
            projectsAccountedFor: initGroup.numberProjects,
            totalProjects: 0,
            errorMessage: '',
        }

        this.handleUpload = this.handleUpload.bind(this);
        this.handleExpoCountChange = this.handleExpoCountChange.bind(this);
        this.handleDeleteProjectGroup = this.handleDeleteProjectGroup.bind(this);
        this.handleNewProjectGroup = this.handleNewProjectGroup.bind(this);
        this.handleUpdateNumberProjects = this.handleUpdateNumberProjects.bind(this);
        this.handleUpdateName = this.handleUpdateName.bind(this);
        this.processUpload = this.processUpload.bind(this);
    }

    public render() {
        return (
            <div>
                <FileInput
                    text={this.state.uploadFileName}
                    fill={true}
                    onInputChange={this.handleUpload} />

                {this.state.csv ?
                    <div style={{
                        marginTop: 10
                    }} >
                        <hr />
                        <FormGroup>
                            <H4>Number of Expos</H4>
                            <NumericInput
                                value={this.state.expoCount}
                                min={1}
                                onValueChange={this.handleExpoCountChange}
                                style={{ width: 50 }} />
                        </FormGroup>

                        <H4>Group Name <span style={{ float: 'right', }}># of Projects</span></H4>

                        {this.state.projectGroups.map((value, index) => {
                            return (
                                <AdminPanelUploadProjectsGroup
                                    key={index}
                                    name={value.name}
                                    index={index}
                                    numberProjects={value.numberProjects}
                                    updateName={this.handleUpdateName}
                                    updateNumberProjects={this.handleUpdateNumberProjects}
                                    deleteRow={this.handleDeleteProjectGroup} />
                            )
                        })}

                        <Button
                            text='New Project Group'
                            intent='primary'
                            onClick={this.handleNewProjectGroup}
                            minimal={true} />

                        <p style={{
                            float: 'right',
                        }}>
                            {this.state.projectsAccountedFor} / {this.state.totalProjects}
                        </p>
                        <p>{this.state.errorMessage}</p>

                        <Button
                            onClick={this.processUpload}
                            fill={true}
                            text='Upload'
                            intent='primary' />
                    </div> : null
                }
            </div>
        )
    }

    private handleUpdateName(index: number, value: string) {
        this.setState((prevState) => {
            const projectGroups = prevState.projectGroups;
            const projectGroup = prevState.projectGroups[index];
            const newProjectGroup: ProjectGroup = {
                name: value,
                numberProjects: projectGroup.numberProjects,
            }

            projectGroups[index] = newProjectGroup;
            return {
                ...prevState,
                projectGroups,
            };
        });
    }

    private handleUpdateNumberProjects(index: number, value: number) {
        this.setState((prevState) => {
            const projectGroup = prevState.projectGroups[index];

            const newValue = prevState.projectsAccountedFor + (value - prevState.projectGroups[index].numberProjects);

            const newProjectGroup: ProjectGroup = {
                name: projectGroup.name,
                numberProjects: value,
            };

            const newProjectGroups = prevState.projectGroups;
            newProjectGroups[index] = newProjectGroup;

            return {
                ...prevState,
                projectGroups: newProjectGroups,
                projectsAccountedFor: newValue,
            };
        });
    }

    private handleDeleteProjectGroup(index: number) {
        this.setState((prevState) => {
            const newValue = prevState.projectsAccountedFor - prevState.projectGroups[index].numberProjects;
            prevState.projectGroups.splice(index, 1);
            return {
                ...prevState,
                projectGroups: prevState.projectGroups,
                projectsAccountedFor: newValue,
            };
        });
    }

    private handleNewProjectGroup() {
        this.setState((prevState) => {
            prevState.projectGroups.push(initGroup);
            return {
                ...prevState,
                projectGroups: prevState.projectGroups,
                projectsAccountedFor: prevState.projectsAccountedFor + initGroup.numberProjects,
            };
        });
    }

    private handleExpoCountChange(value: number) {
        this.setState((prevState) => {
            return {
                ...prevState,
                expoCount: value,
                totalProjects: Math.ceil(prevState.projects.length / value),
            };
        });
    }

    private processUpload() {
        this.setState((prevState) => {
            return {
                ...prevState,
                errorMessage: ''
            }
        }, async () => {
            if (this.state.totalProjects === this.state.projectsAccountedFor) {
                let isValid = true;
                const groupNames: string[] = [];
                for (const projectGroup of this.state.projectGroups) {
                    if (groupNames.includes(projectGroup.name)) {
                        isValid = false;
                    } else {
                        groupNames.push(projectGroup.name);
                    }

                    if (projectGroup.numberProjects < 1) {
                        isValid = false;
                    }
                }

                if (isValid) {
                    let projectNumber = 0;

                    const projects = this.state.projects;

                    const usedTables = new Set<string>();
                    let allocatedAlready = {};
                    for (const p of projects) {
                        if (p.table_number) {
                            if (usedTables.has(p.table_number)) {
                                AppToaster.show({
                                    message: 'Table numbers cannot be duplicate within groups.',
                                    intent: 'warning',
                                });
                                return;
                            }
                            usedTables.add(p.table_number);
                        }
                    }

                    // TODO: Allow projects to have expo preference.
                    for (let expo = 0; expo < this.state.expoCount; expo++) {
                        for (const projectGroup of this.state.projectGroups) {
                            projectNumber = 0;
                            for (let tableNumber = 0; tableNumber < projectGroup.numberProjects; tableNumber++) {
                                if (projectNumber < this.state.projects.length) {
                                    if (allocatedAlready[projectNumber]) {
                                        projectNumber++;
                                        tableNumber--;
                                    } else if (projects[projectNumber].table_number) {
                                        projects[projectNumber].expo_number = expo + 1;
                                        allocatedAlready[projectNumber] = true;
                                        tableNumber--;
                                        projectNumber++;
                                    } else {
                                        projects[projectNumber].expo_number = expo + 1;
                                        projects[projectNumber].table_number = projectGroup.name + ' ' + (tableNumber + 1);
                                        if (!usedTables.has(projects[projectNumber].table_number)) {
                                            allocatedAlready[projectNumber] = true;
                                            projectNumber++;
                                        } else {
                                            projects[projectNumber].table_number = '';
                                        }
                                    }
                                }
                            }
                        }
                    }

                    const projectUploadResult = await fetch('/graphql', {
                        credentials: 'same-origin',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `
                                mutation {
                                    batchUploadProjects(
                                        projects: [${
                                this.state.projects.map((project) => {
                                    return `{
                                                    name: "${project.name}"
                                                    devpost_id: "${project.devpost_id}"
                                                    expo_number: ${project.expo_number}
                                                    table_number: "${project.table_number}"
                                                    sponsor_prizes: "${project.sponsor_prizes}"
                                                }`
                                })
                                }]
                                    ) {
                                        project_id
                                        devpost_id
                                        expo_number
                                        table_number
                                        name
                                        sponsor_prizes
                                        categories {
                                            category_id
                                        }
                                    }
                                }
                            `
                        }),
                    });

                    const json = await projectUploadResult.json();
                    const returnedProjects: ProjectState[] = json.data.batchUploadProjects;

                    const categories = {};
                    const newProjects = returnedProjects.map((project: any) => {
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

                } else {
                    AppToaster.show({
                        message: 'Each project group must have a unique name and at least 1 project.',
                        intent: 'warning',
                    });
                }
            } else {
                AppToaster.show({
                    message: 'You have not accounted for the correct number of projects.',
                    intent: 'warning',
                });
            }
        });

    }

    private parseCSV(results: papa.ParseResult) {
        if (results.errors.length > 0) {
            console.log(results.errors);
            throw new Error('Error parsing CSV');
        }

        console.log(results.data);

        const rowTitles = results.data[0];

        const keys = {
            name: rowTitles.indexOf('Submission Title'),
            url: rowTitles.indexOf('Submission Url'),
            categories: rowTitles.indexOf('Desired Prizes'),
            table_nums: rowTitles.indexOf('Table Numbers')
        }

        console.log(keys);

        if (keys.name === -1 || keys.url === -1 || keys.categories === -1 || keys.table_nums === -1) {
            throw new Error('First row is invalid');
        }

        const data = results.data.splice(1, results.data.length - 1);

        console.log(data);

        const projects: ProjectState[] = [];
        for (const project of data) {
            if (project[keys.name] && project[keys.url]) {
                projects.push({
                    project_id: -1,
                    name: project[keys.name],
                    devpost_id: project[keys.url],
                    table_number: project[keys.table_nums],
                    expo_number: -1,
                    sponsor_prizes: project[keys.categories],
                });
            }
        }

        console.log(projects);

        this.setState((prevState) => {
            return {
                ...prevState,
                projects,
                totalProjects: projects.length,
            };
        });
    }

    private handleUpload(event: any) {
        const target = event.target;
        console.log(target.files);

        if (target.files.length > 0 && target.files[0].name.includes('.csv')) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    uploadFileName: target.files[0].name,
                    csv: target.files.item(0),
                };
            }, () => {
                papa.parse(this.state.csv!, {
                    complete: (results) => {
                        this.parseCSV(results);
                    }
                });
            });
        } else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    uploadFileName: 'Click to upload...',
                    csv: undefined,
                };
            }, () => {
                AppToaster.show({
                    message: 'File must be of type .csv',
                    intent: 'danger',
                });
            });
        }

    }
}

export default AdminPanelUploadProjects;
