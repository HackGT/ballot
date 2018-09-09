import * as React from 'react';
import { CriteriaRanking, ViewType } from '../../util/ranking';
import RankedList from './RankedList';
// import './Ranking.css';

interface AdminPanelRankingProps {}

interface AdminPanelRankingState {
    ranking: CriteriaRanking[];
    viewType: ViewType;
}

class AdminPanelRanking extends React.Component<AdminPanelRankingProps, AdminPanelRankingState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ranking: [],
            viewType: ViewType.byCriteria,
        };
    }

    public async componentWillMount(): Promise<void> {
        const result = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                    getRanking {
                        criteria_name,
                        category_id,
                        category_name,
                        ranking {
                            name,
                            project_id,
                            score,
                            judge_count,
                            devpost_id
                        }
                    }
                }
            `}),
        });

        const data = await result.json();
        const ranking = data.data.getRanking;
        console.log(data);

        this.setState({ ranking });
    }

    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div className='ranked-list'>
                <h1>Ranking</h1>
                <button onClick={() => {
                    this.setState({ viewType: ViewType.byCriteria });
                }}> Show by Criteria</button>
                <button onClick={() => {
                    this.setState({ viewType: ViewType.byCategory });
                }}> Show by Categories</button>
                <RankedList
                    ranking={this.state.ranking}
                    viewType={this.state.viewType} />
            </div >
        );
    }
}

export default AdminPanelRanking;


