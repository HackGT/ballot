import * as React from 'react';
import ProjectsTable from './ProjectsTable';
import { ProjectState } from '../../types/State';
import { Spinner, H6, InputGroup, Checkbox, Collapse, Button, FormGroup } from '@blueprintjs/core';

interface ExpoProps {
    projects: ProjectState[];
    refreshProjects: (projects: ProjectState[]) => void;
}

interface ExpoState {
    isLoading: boolean;
    searchText: string;
    allCategories: {
        [categoryName: string]: boolean,
    };
    categoriesOpen: boolean;
}

const SPINNER_SIZE = 100;

class Expo extends React.Component<ExpoProps, ExpoState> {
    constructor(props: ExpoProps) {
        super(props);

        this.state = {
            isLoading: true,
            searchText: '',
            allCategories: {},
            categoriesOpen: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
    }
    public async componentDidMount() {
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
                allCategories: categories,
            };
        });
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
            <div style={{ width: '100%' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}>
                    <h1 style={{
                        flexGrow: 2,
                    }}>Expo</h1>
                    <Button
                        text='Show Categories'
                        onClick={this.toggleFilters}
                        style={{
                            margin: 5
                        }}
                        active={this.state.categoriesOpen} />

                    <InputGroup
                        name='filter'
                        type='text'
                        autoComplete='off'
                        placeholder='Search'
                        style={{
                            flexGrow: 1,
                        }}
                        value={this.state.searchText}
                        onChange={this.handleChange} />
                </div>

                <div>
                    <Collapse
                        isOpen={this.state.categoriesOpen}
                        keepChildrenMounted={true}>
                        {Object.keys(this.state.allCategories).sort().map((category: string, index: number) => {
                            return (
                                <Checkbox
                                    key={index}
                                    checked={this.state.allCategories[category]}
                                    label={category} />
                            )
                        })}
                    </Collapse>
                </div>
                {
                    this.props.projects ?
                    <ProjectsTable projects={
                        this.props.projects.filter((project) => {
                            if (project.name.toLowerCase().includes(this.state.searchText.toLowerCase())) {
                                return true;
                            }

                            return false;
                        })
                    } />
                    : <div>There are currently no projects</div>
                }
            </div>
        );
    }

    private toggleFilters() {
        this.setState((prevState) => {
            return {
                ...prevState,
                categoriesOpen: !prevState.categoriesOpen,
            };
        });
    }

    private handleChange(event: any) {
        const target = event.target;
        const value = target.value;
        this.setState((prevState) => {
            return {
                ...prevState,
                searchText: value,
            };
        });
    }
};

export default Expo;
