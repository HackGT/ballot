import * as React from 'react';
// import './Projects.scss';

interface ProjectsProps {}

const Projects: React.SFC<ProjectsProps> = (props) => {
    return (
        <div id='register-form'>
            <h1>Welcome!</h1>
            <p>You have been approved as a Projects!</p>
        </div>
    );
};

export default Projects;
