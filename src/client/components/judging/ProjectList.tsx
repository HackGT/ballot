import * as React from 'react';
// import './ProjectList.scss';

interface ProjectListProps {}

const ProjectList: React.SFC<ProjectListProps> = (props) => {
    return (
        <div id='register-form'>
            <h1>Welcome!</h1>
            <p>You have been approved as a ProjectList!</p>
        </div>
    );
};

export default ProjectList;
