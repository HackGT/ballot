import * as React from 'react';
// import './Ranking.scss';

interface RankingProps {}

const Ranking: React.SFC<RankingProps> = (props) => {
    return (
        <div id='register-form'>
            <h1>Welcome!</h1>
            <p>You have been approved as a Ranking!</p>
        </div>
    );
};

export default Ranking;
