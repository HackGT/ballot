import * as React from 'react';
import ProjectsTable from './ProjectsTable';
import { ProjectState } from '../../types/State';
import { Spinner, H6 } from '@blueprintjs/core';

interface ExpoProps {
    projects: ProjectState[];
    refreshProjects: (projects: ProjectState[]) => void;
}

interface ExpoState {
    isLoading: boolean;
}

const SPINNER_SIZE = 100;

class Expo extends React.Component<ExpoProps, ExpoState> {
    constructor(props: ExpoProps) {
        super(props);

        this.state = {
            isLoading: true,
        };
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
        this.props.refreshProjects(json.data.project);

        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: false,
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
            <div>
                <h1>Expo</h1>
                {
                    this.props.projects ?
                    <ProjectsTable projects={this.props.projects} />
                    : undefined
                }
            </div>
        );
    }
};

export default Expo;
