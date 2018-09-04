import * as React from 'react';
import { CategoryState, CriteriaState } from '../../types/State';
import { Card, H3, Button, Alert, EditableText, Spinner, ProgressBar } from '@blueprintjs/core';
import AdminPanelNewCategoryCriteria from './AdminPanelNewCategoryCriteria';

interface AdminPanelCategoryCardProps {
    category: CategoryState;
    editCategory: (category: CategoryState) => void;
    removeCategory: (categoryID: number) => void;
    addCriteria: (criteria: CriteriaState) => void;
    editCriteria: (criteria: CriteriaState) => void;
    removeCriteria: (criteriaID: number, categoryID: number) => void;
}

interface AdminPanelCategoryCardState {
    criteria: CriteriaState[];
    category: CategoryState;
    deleteOpen: boolean;
    editMode: boolean;
    isDeleting: boolean;
}

let nextCriteriaID = -1;

class AdminPanelCategoryCard extends React.Component<AdminPanelCategoryCardProps, AdminPanelCategoryCardState> {
    constructor(props: AdminPanelCategoryCardProps) {
        super(props);

        this.state = {
            criteria: props.category.criteria,
            category: props.category,
            deleteOpen: false,
            editMode: false,
            isDeleting: false,
        };

        this.handleCancel = this.handleCancel.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.addMoreCriteria = this.addMoreCriteria.bind(this);
        this.handleRemoveCriteriaRow = this.handleRemoveCriteriaRow.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);

        this.handleCriteriaUpdate = this.handleCriteriaUpdate.bind(this);
    }

    public render() {
        return (
            <Card
                style={{
                    width: '100%',
                    maxWidth: 420,
                    margin: 10,
                }}>

                <Alert
                    isOpen={this.state.deleteOpen}
                    cancelButtonText='Cancel'
                    confirmButtonText='Delete'
                    canOutsideClickCancel={true}
                    canEscapeKeyCancel={true}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleDelete}
                    intent='danger'>
                    {this.state.isDeleting ?
                        <Spinner /> :
                        <div>
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete this category?</p>
                        </div>
                    }
                </Alert>

                <H3>
                    <EditableText
                        defaultValue={this.state.category.name}
                        disabled={!this.state.editMode}
                        onConfirm={this.handleNameChange}>

                        {this.props.category.name}
                    </EditableText>
                    <span style={{ float: 'right' }}>
                        {this.state.editMode ?
                        <div>
                            <Button name='delete' icon='small-cross' small={true} intent='danger' minimal={true} onClick={this.handleDeleteButton} />
                            <Button name='save' icon='tick' small={true} intent='success' minimal={true} onClick={this.handleSave} />
                        </div> :
                        <Button name='edit' icon='edit' small={true} minimal={true} onClick={this.handleEdit} />}
                    </span>
                </H3>

                {this.props.category.criteria.map((criteria: CriteriaState, index: number) => {
                    return (
                        <AdminPanelNewCategoryCriteria
                            update={this.handleCriteriaUpdate}
                            removeCriteriaRow={this.handleRemoveCriteriaRow}
                            editMode={this.state.editMode}
                            index={index}
                            key={criteria.criteria_id}
                            criteria={criteria} />
                    );
                })}

                {this.state.editMode ?
                    <div style={{ margin: '0px 0' }}>
                        <Button intent='primary' text='Add More Criteria' minimal={true} onClick={this.addMoreCriteria} />
                    </div> : null
                }

            </Card>
        )
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

    private handleNameChange(value: string) {
        this.setState((prevState) => {
            return {
                ...prevState,
                category: {
                    ...prevState.category,
                    name: value,
                }
            };
        });
    }

    private async handleRemoveCriteriaRow(index: number) {
        if (this.state.criteria[index].criteria_id >= 0) {
            const deleteResult = await fetch('/graphql', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        mutation {
                            deleteCriterion(
                                criteria_id: ${this.state.criteria[index].criteria_id}
                            )
                        }
                    `
                }),
            });

            this.props.removeCriteria(this.state.criteria[index].criteria_id, this.props.category.category_id);
        }

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
                criteria_id: nextCriteriaID--,
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

    private handleDeleteButton() {
        this.setState((prevState) => {
            return {
                ...prevState,
                deleteOpen: true,
            }
        });
    }

    private handleDelete() {
        const categoryID = this.state.category.category_id;

        if (!this.state.isDeleting) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    isDeleting: true,
                };
            }, async () => {
                await fetch('/graphql', {
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            mutation {
                                deleteCategory(
                                    category_id: ${this.state.category.category_id}
                                )
                            }
                        `
                    }),
                });

                this.props.removeCategory(this.state.category.category_id);
            });
        }
    }

    private async handleSave() {
        const createCriteria = (criteria: CriteriaState) => {
            fetch('/graphql', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: criteria.criteria_id < 0 ? `
                        mutation {
                            addCriterion(
                                category_id: ${this.state.category.category_id}
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
                    ` : `
                        mutation {
                            updateCriterion(
                                criteria_id: ${criteria.criteria_id}
                                update: {
                                    name: "${criteria.name}"
                                    rubric: ${JSON.stringify(criteria.rubric)}
                                    min_score: ${criteria.min_score}
                                    max_score: ${criteria.max_score}
                                    category_id: ${this.state.category.category_id}
                                }
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
        };

        const criteriaResults = await Promise.all(this.state.criteria.map((criteria: CriteriaState) => {
            createCriteria(criteria);
            if (criteria.criteria_id < 0) {
                this.props.addCriteria(criteria);
            } else {
                this.props.editCriteria(criteria);
            }
        }));

        this.props.editCategory(this.state.category);

        this.setState((prevState) => {
            return {
                ...prevState,
                editMode: false,
            }
        });
    }

    private handleEdit() {
        this.setState((prevState) => {
            return {
                ...prevState,
                editMode: true,
            }
        });
    }

    private handleCancel() {
        this.setState((prevState) => {
            return {
                ...prevState,
                deleteOpen: false,
            }
        });
    }
}

export default AdminPanelCategoryCard;
