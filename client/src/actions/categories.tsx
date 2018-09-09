import { Dispatch } from 'redux';
import { CategoryState, CriteriaState } from '../types/State';
import Action from '../types/Action';

export const REFRESH_CATEGORIES = 'REFRESH_CATEGORIES';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const EDIT_CATEGORY = 'EDIT_CATEGORY';
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
export const ADD_CRITERIA = 'ADD_CRITERIA';
export const EDIT_CRITERIA = 'EDIT_CRITERIA';
export const REMOVE_CRITERIA = 'REMOVE_CRITERIA';

export interface RefreshCategoriesAction extends Action {
    categories: CategoryState[];
}

export interface AddCategoryAction extends Action {
    category: CategoryState;
}

export interface EditCategoryAction extends AddCategoryAction {}

export interface RemoveCategoryAction extends Action {
    categoryID: number;
}

export interface AddCriteriaAction extends Action {
    criteria: CriteriaState;
}

export interface EditCriteriaAction extends Action {
    criteria: CriteriaState;
}

export interface RemoveCriteriaAction extends Action {
    criteriaID: number;
    categoryID: number;
}

export const refreshCategories: (categories: CategoryState[]) => RefreshCategoriesAction = (categories: CategoryState[]) => {
    return {
        type: REFRESH_CATEGORIES,
        categories,
    }
}

export const addCategory: (category: CategoryState) => AddCategoryAction = (category: CategoryState) => {
    return {
        type: ADD_CATEGORY,
        category,
    }
}

export const editCategory: (category: CategoryState) => EditCategoryAction = (category: CategoryState) => {
    return {
        type: EDIT_CATEGORY,
        category,
    }
}

export const removeCategory: (categoryID: number) => RemoveCategoryAction = (categoryID: number) => {
    return {
        type: REMOVE_CATEGORY,
        categoryID,
    }
}

export const addCriteria: (criteria: CriteriaState) => AddCriteriaAction = (criteria: CriteriaState) => {
    return {
        type: ADD_CRITERIA,
        criteria,
    }
}

export const editCriteria: (criteria: CriteriaState) => EditCriteriaAction = (criteria: CriteriaState) => {
    return {
        type: EDIT_CRITERIA,
        criteria,
    }
}

export const removeCriteria: (criteriaID: number, categoryID: number) => RemoveCriteriaAction = (criteriaID: number, categoryID: number) => {
    return {
        type: REMOVE_CRITERIA,
        criteriaID,
        categoryID,
    }
}
