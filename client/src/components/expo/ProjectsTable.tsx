import * as React from 'react';
import { ProjectState } from '../../types/State';
import { Card, Tag } from '@blueprintjs/core';

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
            {props.projects.length > 0 ? props.projects.map((project: ProjectState) => {
                return (
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
                        <div>{project.sponsor_prizes.map((prize: string, index: number) => {
                            return (
                                <Tag style={{ margin: 2 }} key={index} minimal={true}>{prize}</Tag>
                            )
                        })}</div>
                    </Card>
                )
            }) : <div>No projects match this criteria.</div>}
        </div>
    )
}

export default ProjectsTable;
