import * as React from 'react';
import { ProjectState } from '../../types/State';
import { Card, Tag } from '@blueprintjs/core';

interface ProjectsTableProps {
    projects: ProjectState[];
    currentCategory: string;
}

const colorMap = {
    'orange': '#FF851B',
    'green': '#009432',
    'blue': '#0074D9',
    'purple': '#B10DC9',
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
                        <h3 style={{
                            color: colorMap[project.table_number.toLowerCase().split(' ')[0]],
                        }}>{project.name}</h3>
                        <p>Expo: {project.expo_number} Table: {project.table_number}</p>
                        <div>{project.sponsor_prizes.map((prize: string, index: number) => {
                            return (
                                <Tag
                                    style={{ margin: 2 }}
                                    key={index}
                                    intent={
                                        props.currentCategory === prize ? 'primary' : 'none'
                                    }
                                    minimal={true}>
                                    {prize}
                                </Tag>
                            )
                        })}</div>
                    </Card>
                )
            }) : <div>No projects match this criteria.</div>}
        </div>
    )
}

export default ProjectsTable;
