import * as React from 'react';
import { ProjectState } from '../../types/State';
import ProjectsTable from '../expo/ProjectsTable';
// import './Projects.scss';

interface ProjectsProps {
    projects: ProjectState[];
    refreshProjects: (projects: ProjectState[]) => void;
}

class Projects extends React.Component<ProjectsProps, {}> {
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

    render() {
        return (
            <div>
                <h1>Projects</h1>
                {
                    this.props.projects ?
                    <ProjectsTable projects={this.props.projects} />
                    : undefined
                }
            </div>
        );
    }
};

export default Projects;
