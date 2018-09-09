import * as React from 'react';
import axios from 'axios';
import { H1, EditableText, Button, Switch } from '@blueprintjs/core';
import { CategoryState, CriteriaState } from '../../types/State';
import AdminPanelNewCategoryCriteria from './AdminPanelNewCategoryCriteria';

interface AdminPanelNewCategoryProps {
    closeDialog: () => void;
    addCategory: (category: CategoryState) => void;
    addCriteria: (criteria: CriteriaState) => void;
}

interface AdminPanelNewCategoryState {
    categoryName: string;
    criteria: CriteriaState[];
    isPrimary: boolean;
}

let nextCriteriaID = 1;

const criteriaInit = {
    criteria_id: 0,
    name: '',
    rubric: '',
    min_score: 1,
    max_score: 10,
    category_id: 0,
};

class AdminPanelNewCategory extends React.Component<AdminPanelNewCategoryProps, AdminPanelNewCategoryState> {
    constructor(props: AdminPanelNewCategoryProps) {
        super(props);

        this.state = {
            categoryName: '',
            criteria: [criteriaInit],
            isPrimary: false,
        };

        this.addMoreCriteria = this.addMoreCriteria.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleRemoveCriteriaRow = this.handleRemoveCriteriaRow.bind(this);
        this.createCategory = this.createCategory.bind(this);
        this.handleCriteriaUpdate = this.handleCriteriaUpdate.bind(this);
        this.handlePrimaryChange = this.handlePrimaryChange.bind(this);
    }

    public render() {
        return (
            <div>
                <H1>
                    <EditableText
                        placeholder='Category Name'
                        onChange={this.handleNameChange} />
                </H1>

                <Switch
                    checked={this.state.isPrimary}
                    label='Primary Category'
                    onChange={this.handlePrimaryChange} />

                {this.state.criteria.map((criteria: CriteriaState, index: number) => {
                    return (
                        <AdminPanelNewCategoryCriteria
                            key={criteria.criteria_id}
                            index={index}
                            editMode={true}
                            removeCriteriaRow={this.handleRemoveCriteriaRow}
                            update={this.handleCriteriaUpdate}
                            criteria={criteria} />
                    );
                })}

                <div style={{ margin: '0px 0' }}>
                    <Button intent='primary' text='Add More Criteria' minimal={true} onClick={this.addMoreCriteria} />
                </div>
                <div style={{ margin: '10px 0 0', float: 'right' }}>
                    <Button text='Cancel' onClick={this.props.closeDialog} />
                    <Button intent='primary' text='Create Category' onClick={this.createCategory} />
                </div>
            </div>
        )
    }

    private handlePrimaryChange(event: any) {
        this.setState((prevState) => {
            return {
                ...prevState,
                isPrimary: !prevState.isPrimary,
            };
        });
    }

    private handleCriteriaUpdate(criteria: CriteriaState, index: number) {
        this.setState((prevState) => {
            prevState.criteria[index] = criteria;
            return {
                ...prevState,
                criteria: prevState.criteria,
            };
        });
    }

    private async createCategory() {
        const categoryResult = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation {
                        createCategory(
                            name: "${this.state.categoryName}",
                            is_primary: ${this.state.isPrimary},
                        ) {
                            category_id
                            name
                            is_primary
                        }
                    }
                `
            }),
        });

        const categoryResultJSON = await categoryResult.json()
        const categoryID = categoryResultJSON.data.createCategory.category_id;

        const createCriteria = (criteria: CriteriaState) => {
            fetch('/graphql', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        mutation {
                            addCriterion(
                                category_id: ${categoryID}
                                name: "${criteria.name}"
                                rubric: ${JSON.stringify(criteria.rubric)}
                                min_score: ${criteria.min_score}
                                max_score: ${criteria.max_score}
                            ) {
                                criteria_id
                                name
                                rubric
                                min_score
                                max_score
                            }
                        }
                    `
                }),
            });
        }

        const criteriaResults = await Promise.all(this.state.criteria.map((criteria: CriteriaState) => {
            createCriteria(criteria);
            this.props.addCriteria(criteria);
        }));

        const newCategory: CategoryState = {
            category_id: categoryID,
            name: this.state.categoryName,
            is_primary: this.state.isPrimary,
            criteria: this.state.criteria,
        }

        this.props.addCategory(newCategory);
        this.props.closeDialog();
    }

    private handleNameChange(value: string) {
        this.setState((prevState) => {
            return {
                ...prevState,
                categoryName: value,
            };
        });
    }

    private handleRemoveCriteriaRow(index: number) {
        this.setState((prevState) => {
            prevState.criteria.splice(index, 1);
            return {
                ...prevState,
                criteria: prevState.criteria,
            };
        });
    }

    private addMoreCriteria() {
        this.setState((prevState) => {
            prevState.criteria.push({
                criteria_id: nextCriteriaID++,
                name: '',
                rubric: '',
                min_score: 1,
                max_score: 10,
                category_id: 0,
            });
            return {
                ...prevState,
                criteria: prevState.criteria,
            };
        });
    }
}

export default AdminPanelNewCategory;
