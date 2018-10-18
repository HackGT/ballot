import * as React from 'react';
import { CategoryState, CriteriaState } from '../../types/State';
import { Card, H1, H3, H4, H6, Button, Dialog, Classes, EditableText, NumericInput, Spinner, NonIdealState, Callout } from '@blueprintjs/core';
import AdminPanelNewCategoryCriteria from './AdminPanelNewCategoryCriteria';
import AdminPanelNewCategory from './AdminPanelNewCategory';
import AdminPanelCategoryCard from './AdminPanelCategoryCard';

interface AdminPanelCategoriesProps {
    categories: CategoryState[];
    refreshCategories: (categories: CategoryState[]) => void;
    addCategory: (category: CategoryState) => void;
    editCategory: (category: CategoryState) => void;
    removeCategory: (categoryID: number) => void;
    addCriteria: (criteria: CriteriaState) => void;
    editCriteria: (criteria: CriteriaState) => void;
    removeCriteria: (criteriaID: number, categoryID: number) => void;
}

interface AdminPanelCategoriesState {
    newCategoryDialogOpen: boolean;
    isLoading: boolean;
}

const SPINNER_SIZE = 100;

class AdminPanelCategories extends React.Component<AdminPanelCategoriesProps, AdminPanelCategoriesState> {
    constructor(props: AdminPanelCategoriesProps) {
        super(props);

        this.state = {
            newCategoryDialogOpen: false,
            isLoading: true,
        };

        this.openNewCategoryDialog = this.openNewCategoryDialog.bind(this);
        this.closeNewCategoryDialog = this.closeNewCategoryDialog.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }
    public async componentDidMount() {
        this.fetchCategories();
    }

    public render() {
        if (this.state.isLoading) {
            return (
                <div style={{
                    width: '100%',
                }}>
                    <div style={{
                        width: SPINNER_SIZE,
                        margin: '20px auto',
                    }}>
                        <Spinner size={SPINNER_SIZE} />
                    </div>
                    <H6 style={{
                        textAlign: 'center',
                    }}>
                        Loading categories and criteria.
                    </H6>
                </div>
            )
        }
        return (
            <div>
                <Dialog
                    isOpen={this.state.newCategoryDialogOpen}
                    canEscapeKeyClose={true}
                    canOutsideClickClose={true}
                    title='New Category'
                    onClose={this.closeNewCategoryDialog}>

                    <AdminPanelNewCategory
                        closeDialog={this.closeNewCategoryDialog}
                        addCategory={this.props.addCategory}
                        addCriteria={this.props.addCriteria}
                    />

                </Dialog>
                <h1>Categories
                    <span style={{
                        float: 'right',
                    }}>
                        <Button name='refresh' icon='refresh' large={true} intent='primary' minimal={true} onClick={this.handleRefresh} />
                        <Button name='new' icon='plus' large={true} intent='primary' minimal={true} onClick={this.openNewCategoryDialog} />
                    </span>
                </h1>
                <Callout intent='warning' icon='warning-sign'>You must reupload projects if you change criteria or categories.</Callout>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexFlow: 'row wrap',
                    justifyContent: 'center',
                }}>
                    {this.props.categories.length > 0 ?
                        this.props.categories.map((category: CategoryState) => {
                            return (
                                <AdminPanelCategoryCard
                                    key={category.category_id}
                                    category={category}
                                    editCategory={this.props.editCategory}
                                    removeCategory={this.props.removeCategory}
                                    addCriteria={this.props.addCriteria}
                                    editCriteria={this.props.editCriteria}
                                    removeCriteria={this.props.removeCriteria} />
                            );
                        }) :
                        <NonIdealState
                            icon='database'
                            title='No Categories Found'
                            description='There are no categories on the server. Click above to create a new category. '/>
                    }
                </div>
            </div>
        );
    }

    private async fetchCategories() {
        const result = await fetch('/graphql', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                    categories {
                        category_id
                        name
                        is_primary
                        criteria {
                            criteria_id
                            name
                            rubric
                            min_score
                            max_score
                            category_id
                        }
                    }
                }`
            })
        });

        const json = await result.json();
        this.props.refreshCategories(json.data.categories);
        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: false,
            };
        });
    }

    private handleRefresh() {
        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: true,
            };
        }, () => {
            this.fetchCategories();
        });
    }

    private openNewCategoryDialog() {
        this.setState((prevState) => {
            return {
                ...prevState,
                newCategoryDialogOpen: true,
            };
        });
    }

    private closeNewCategoryDialog() {
        this.setState((prevState) => {
            return {
                ...prevState,
                newCategoryDialogOpen: false,
            };
        });
    }
};

export default AdminPanelCategories;
