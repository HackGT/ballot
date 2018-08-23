import * as React from 'react';
// import './Expo.css';
import ProjectsTable from './ProjectsTable';
import { ProjectState } from '../../types/State';

interface ExpoProps {
    projects: ProjectState[];
    refreshProjects: (projects: ProjectState[]) => void;
}

class Expo extends React.Component<ExpoProps, {}> {
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
                        categories {
                            name
                        }
                    }
                }`
            }),
        });

        const json = await result.json();
        this.props.refreshProjects(json.data.project);
    }

    public render() {
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
