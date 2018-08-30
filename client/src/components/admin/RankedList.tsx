import * as React from 'react';
import { CategoryRanking, CriteriaRanking, ViewType, rankCriteriaToCategory } from '../../util/ranking';
import RankedScore from './RankedScore';

interface RankedListProps {
    ranking: CriteriaRanking[];
    viewType: ViewType;
}

interface RankedListState {
    filter: string;
}

class RankedList extends React.Component<RankedListProps, RankedListState> {
    constructor(props: any) {
        super(props);
        this.state = { filter: '' };
    }

    public componentWillReceiveProps(nextProps: RankedListProps): void {
        if (nextProps.viewType !== this.props.viewType) {
            this.setState({ filter: '' });
        }
    }

    public render(): React.ReactElement<HTMLDivElement> {
        const elements = [];
        const categorySet = new Set();
        if (this.props.viewType === ViewType.byCriteria) {
            for (const criteria of this.props.ranking) {
                categorySet.add(criteria.category_name);
                if (!this.state.filter ||
                    this.state.filter === criteria.category_name) {
                    elements.push(
                        <div key={criteria.criteria_id}>
                            <h2>{criteria.category_name}</h2>
                            <h3>{criteria.criteria_name}</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Project Name (id)</td>
                                        <td>Average Score</td>
                                        <td>Number of judge entries</td>
                                    </tr>
                                    {criteria.ranking.map((project) =>
                                        <RankedScore key={project.project_id}
                                            {...project} />)}
                                </tbody>
                            </table>
                        </div>
                    );
                }
            }
        } else {
            const categories = rankCriteriaToCategory(this.props.ranking);
            for (const category of categories) {
                elements.push(
                    <div key={category.category_id}>
                        <h2>{category.category_name}</h2>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Project Name (id)</td>
                                    <td>Average Score</td>
                                    <td>Number of judge entries</td>
                                </tr>
                                {category.ranking.map((project) =>
                                    <RankedScore key={project.project_id}
                                        {...project} />)}
                            </tbody>
                        </table>
                    </div>
                );
            }
        }

        return (
            <div>
                {Array.from(categorySet).map((category) => {
                    return <button key={category}
                        onClick={
                            () => { this.setState({ filter: category }); }}>
                        {category}
                    </button>;
                })}
                {elements}
            </div>
        );
    }
}

export default RankedList;
