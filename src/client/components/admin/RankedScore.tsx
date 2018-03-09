import * as React from 'react';

export interface RankedScoreProps {
    name: string;
    project_id: string;
    score: number;
    judge_count: number;
    devpost_id: string;
}

const RankedScore: React.SFC<RankedScoreProps> = (props) => {
    return (
        <tr>
            <td><a href={'https://devpost.com/software/' + props.devpost_id}
                target='_blank'>
                {props.name} ({props.project_id})</a></td>
            <td>{props.score}</td>
            <td>{props.judge_count}</td>
        </tr>
    );
};

export default RankedScore;
