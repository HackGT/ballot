import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../../util/authorization';

import AdminPanelCategories from '../../components/admin/AdminPanelCategories';
import {
    refreshCategories,
    addCategory,
    editCategory,
    removeCategory,
    addCriteria,
    editCriteria,
    removeCriteria,
} from '../../actions/categories';

import { State, CategoryState, CriteriaState } from '../../types/State';

interface StateToProps {
    categories: CategoryState[];
}

interface DispatchToProps {
    refreshCategories: (categories: CategoryState[]) => void;
    addCategory: (category: CategoryState) => void;
    editCategory: (category: CategoryState) => void;
    removeCategory: (categoryID: number) => void;
    addCriteria: (criteria: CriteriaState) => void;
    editCriteria: (criteria: CriteriaState) => void;
    removeCriteria: (criteriaID: number, categoryID: number) => void;
}

const mapStateToProps = (state: State): StateToProps => {
    return {
        categories: state.categories,
    }
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        refreshCategories: (categories: CategoryState[]) => {
            dispatch(refreshCategories(categories));
        },
        addCategory: (category: CategoryState) => {
            dispatch(addCategory(category));
        },
        editCategory: (category: CategoryState) => {
            dispatch(editCategory(category));
        },
        removeCategory: (categoryID: number) => {
            dispatch(removeCategory(categoryID));
        },
        addCriteria: (criteria: CriteriaState) => {
            dispatch(addCriteria(criteria));
        },
        editCriteria: (criteria: CriteriaState) => {
            dispatch(editCriteria(criteria));
        },
        removeCriteria: (criteriaID: number, categoryID: number) => {
            dispatch(removeCriteria(criteriaID, categoryID));
        },
    }
};

const CategoriesContainer = connect<StateToProps, DispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(AdminPanelCategories);

export default CategoriesContainer;
