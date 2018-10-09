import * as React from 'react';
import { ProjectState } from '../../types/State';
import { Card } from '@blueprintjs/core';

interface ProjectsTableProps {
    projects: ProjectState[];
}

const ProjectsTable: React.SFC<ProjectsTableProps> = (props) => {
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
        }}>
            {props.projects.map((project: ProjectState) => {
                return (
                    // <a href={'https://devpost.com/software/' + project.devpost_id} target='_blank' key={project.project_id} >
                    <Card
                        interactive={true}
                        key={project.project_id}
                        onClick={() => {
                            window.open(project.devpost_id);
                        }}
                        style={{
                            width: '100%',
                            maxWidth: 300,
                            margin: 5,
                        }}>
                        <h3>{project.project_id}: {project.name}</h3>
                        <p>Expo: {project.expo_number} Table: {project.table_number}</p>
                        <p>{project.sponsor_prizes}</p>
                    </Card>
                    // </a>
                )
            })}
        </div>
    )
}

export default ProjectsTable;
