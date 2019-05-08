import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

interface PageAdminProjectsProps {
    // account: User;
}

const PageAdminProjects: React.FC<PageAdminProjectsProps> = (props) => {
    return (
        <div>
            <div style={{ paddingBottom: 15 }}>
                <h1 style={{ display: 'inline'}}>Projects</h1>
                <span style={{float: 'right'}}>
                    <Button animated='fade'>
                        <Button.Content visible>Upload CSV</Button.Content>
                        <Button.Content hidden><Icon name='upload' /></Button.Content>
                    </Button>
                    <Button animated='fade' color='blue'>
                        <Button.Content visible>Add Project</Button.Content>
                        <Button.Content hidden><Icon name='plus' /></Button.Content>
                    </Button>
                </span>
            </div>
        </div>
    )
}

export default PageAdminProjects;
