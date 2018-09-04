import * as React from 'react';
import { CriteriaState } from '../../types/State';
import { H4, H6, NumericInput, EditableText, Button } from '@blueprintjs/core';

interface AdminPanelCategoryCriteriaProps {
    criteria: CriteriaState;
    index: number;
    editMode: boolean;
    removeCriteriaRow: (index: number) => void;
    update: (criteria: CriteriaState, index: number) => void;
}

interface AdminPanelCategoryCriteriaState {
    criteria: CriteriaState;
}

function escapeString(value: string): string {
    return value.replace(/\\n/g, "\\n");
 }


class AdminPanelNewCategoryCriteria extends React.Component<AdminPanelCategoryCriteriaProps, AdminPanelCategoryCriteriaState> {
    constructor(props: AdminPanelCategoryCriteriaProps) {
        super(props);

        this.state = {
            criteria: props.criteria,
        }

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleRubricChange = this.handleRubricChange.bind(this);
        this.handleScoreMinChange = this.handleScoreMinChange.bind(this);
        this.handleScoreMaxChange = this.handleScoreMaxChange.bind(this);
    }

    public render() {
        return (
            <div style={{
                margin: '20px 0',
            }}>
                <H4 style={{
                    margin: '2px 0 5px',
                }}>
                    <EditableText
                        placeholder='Criteria Name'
                        disabled={!this.props.editMode}
                        defaultValue={this.state.criteria.name}
                        onConfirm={this.handleNameChange}
                    />
                        {this.props.editMode ?
                            <span style={{
                                float: 'right',
                            }}>
                                <Button
                                    name='new'
                                    icon='small-cross'
                                    small={true}
                                    onClick={this.handleDeleteClick}
                                    intent='danger'
                                    minimal={true} />
                            </span> : null
                        }
                </H4>

                {this.props.editMode ?
                    <EditableText
                        className='fixEditable'
                        placeholder='Rubric'
                        disabled={!this.props.editMode}
                        defaultValue={this.state.criteria.rubric}
                        multiline={true}
                        onConfirm={this.handleRubricChange}
                    /> :
                    <p style={{ whiteSpace: 'pre-wrap' }}>{this.state.criteria.rubric}</p>
                }

                {this.props.editMode ?
                    <div>
                        <H6 style={{
                            marginTop: '20px',
                        }}>
                            Score Range:
                        </H6>
                        <div style={{ display: 'flex' }}>
                            <NumericInput
                                value={this.state.criteria.min_score}
                                onValueChange={this.handleScoreMinChange}
                                min={0}
                                max={this.state.criteria.max_score}
                                style={{ width: 50 }} />
                            <NumericInput
                                value={this.state.criteria.max_score}
                                min={this.state.criteria.min_score + 1}
                                onValueChange={this.handleScoreMaxChange}
                                style={{ width: 50 }} />
                        </div>
                    </div> :
                    <div style={{
                        marginTop: 10,
                    }}>
                        Scored {this.state.criteria.min_score} - {this.state.criteria.max_score}
                    </div>
                }

            </div>
        )
    }

    private handleNameChange(value: string) {
        this.setState((prevState) => {
            return {
                ...prevState,
                criteria: {
                    ...prevState.criteria,
                    name: value,
                },
            };
        }, () => {
            this.props.update(this.state.criteria, this.props.index);
        });
    }

    private handleRubricChange(value: string) {
        this.setState((prevState) => {
            return {
                ...prevState,
                criteria: {
                    ...prevState.criteria,
                    rubric: value,
                },
            };
        }, () => {
            this.props.update(this.state.criteria, this.props.index);
        });
    }

    private handleScoreMinChange(value: number) {
        this.setState((prevState) => {
            return {
                ...prevState,
                criteria: {
                    ...prevState.criteria,
                    min_score: value,
                },
            };
        }, () => {
            this.props.update(this.state.criteria, this.props.index);
        });
    }

    private handleScoreMaxChange(value: number) {
        this.setState((prevState) => {
            return {
                ...prevState,
                criteria: {
                    ...prevState.criteria,
                    max_score: value,
                },
            };
        }, () => {
            this.props.update(this.state.criteria, this.props.index);
        });
    }

    private handleDeleteClick() {
        this.props.removeCriteriaRow(this.props.index);
    }
}

export default AdminPanelNewCategoryCriteria;
