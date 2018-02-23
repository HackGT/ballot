import * as React from 'react';
// import './Judge.scss';

interface JudgeProps {}

const Judge: React.SFC<JudgeProps> = (props) => {
    return (
        <div>
            <h1>Welcome!</h1>
            <p>You have been approved as a Judge!</p>
        </div>
    );
};

export default Judge;
