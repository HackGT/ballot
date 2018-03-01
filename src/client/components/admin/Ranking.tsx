import * as React from 'react';
// import './Ranking.scss';

interface RankingProps {
    match: any;
}

const Ranking: React.SFC<RankingProps> = (props) => {
    return (
        <div>
            <h1>Ranking</h1>
            <p>This is where rankings will show up.</p>
        </div>
    );
};

export default Ranking;
