import * as React from 'react';
import ProjectsTable from './ProjectsTable';
import { ProjectState } from '../../types/State';
import { Spinner, H6, InputGroup, Checkbox, Collapse, Button, FormGroup, RadioGroup, Radio, Dialog, Classes, TextArea } from '@blueprintjs/core';

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
    currentCategory: string;
    rawText: string;
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
            currentCategory: 'All',
            rawText: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.openCategories = this.openCategories.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.closeCategories = this.closeCategories.bind(this);
        this.convertToText = this.convertToText.bind(this);
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
                        text='Categories'
                        onClick={this.openCategories}
                        style={{
                            margin: 5
                        }}
                        active={this.state.categoriesOpen} />
                    <InputGroup
                        name='filter'
                        type='text'
                        autoComplete='off'
                        placeholder='Search Project Names'
                        style={{
                            flexGrow: 1,
                        }}
                        value={this.state.searchText}
                        onChange={this.handleChange} />
                </div>

                <div>
                    <Dialog
                        title='Pick A Category'
                        onClose={this.closeCategories}
                        isOpen={this.state.categoriesOpen}>
                        <div className={Classes.DIALOG_BODY}>
                            <RadioGroup onChange={this.changeCategory} selectedValue={this.state.currentCategory}>
                                <Radio key={-1} value='All' label='All' />
                                {Object.keys(this.state.allCategories).sort().map((category: string, index: number) => {
                                    return (
                                        <Radio
                                            key={index}
                                            value={category}
                                            label={category} />
                                    );
                                })}
                            </RadioGroup>
                        </div>
                    </Dialog>
                </div>
                {
                    this.props.projects ?
                    <ProjectsTable projects={
                            this.props.projects.filter((project) => {
                                if (project.name.toLowerCase().includes(this.state.searchText.toLowerCase())) {
                                    if (this.state.currentCategory === 'All' || project.sponsor_prizes.includes(this.state.currentCategory)) {
                                        return true;
                                    }
                                }

                                return false;
                            })
                        }
                        currentCategory={this.state.currentCategory}
                     />
                    : <div>There are currently no projects</div>
                }
                <div style={{ textAlign: 'center', margin: 10 }}>
                    <Button onClick={this.convertToText}>Show Raw Text for Current Query</Button>
                </div>

                <TextArea style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    width: '100%',
                    height: '30vh',
                }} disabled={true} value={this.state.rawText} />
            </div>
        );
    }

    private convertToText() {
        const projects = this.props.projects.filter((project) => {
            if (project.name.toLowerCase().includes(this.state.searchText.toLowerCase())) {
                if (this.state.currentCategory === 'All' || project.sponsor_prizes.includes(this.state.currentCategory)) {
                    return true;
                }
            }

            return false;
        });

        let text = '';

        for (const project of projects) {
            text += `${project.name}\nExpo: ${project.expo_number} Table: ${project.table_number}\n\n`
        }

        this.setState((prevState) => {
            return {
                ...prevState,
                rawText: text,
            };
        });
    }

    private changeCategory(event: any) {
        const target = event.target;
        const value = target.value;
        // console.log(value);
        this.setState((prevState) => {
            return {
                ...prevState,
                currentCategory: value,
                rawText: '',
            };
        });
    }

    private closeCategories() {
        this.setState((prevState) => {
            return {
                ...prevState,
                categoriesOpen: false,
            };
        });
    }

    private openCategories() {
        this.setState((prevState) => {
            return {
                ...prevState,
                categoriesOpen: true,
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
                rawText: '',
            };
        });
    }
};

export default Expo;
