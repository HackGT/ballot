import * as React from 'react';
import { ProjectState } from '../../types/State';

interface ProjectsTableProps {
    projects: ProjectState[];
}

const ProjectsTable: React.SFC<ProjectsTableProps> = (props) => {
    return (
        <div className='project-table'>
            <table>
                <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>DevPost ID</th>
                        <th>Name</th>
                        <th>Expo Number</th>
                        <th>Table Number</th>
                    </tr>
                </thead>
                <tbody>
                    {props.projects.map((project: ProjectState) => {
                        return (
                            <tr key={project.project_id}>
                                <td>{project.project_id}</td>
                                <td>{project.devpost_id}</td>
                                <td>{project.name}</td>
                                <td>{project.expo_number}</td>
                                <td>{project.table_number}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ProjectsTable;
