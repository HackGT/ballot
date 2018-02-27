import * as React from 'react';
// import './JudgingList.scss';

interface JudgingListProps {}

const JudgingList: React.SFC<JudgingListProps> = (props) => {
    return (
        <div id='register-form'>
            <h1>Welcome!</h1>
            <p>You have been approved as a JudgingList!</p>
        </div>
    );
};

export default JudgingList;
