import {
    REFRESH_CATEGORIES,
    RefreshCategoriesAction,
    ADD_CATEGORY,
    AddCategoryAction,
    ADD_CRITERIA,
    AddCriteriaAction,
    EDIT_CATEGORY,
    EditCategoryAction,
    EDIT_CRITERIA,
    EditCriteriaAction,
    REMOVE_CATEGORY,
    RemoveCategoryAction,
    REMOVE_CRITERIA,
    RemoveCriteriaAction,
} from '../actions/categories'

import Action from '../types/Action';
import { CategoryState, CriteriaState } from '../types/State';

const categories = (state: CategoryState[] = [], actionAny: Action): CategoryState[] => {
    switch (actionAny.type) {
        case REFRESH_CATEGORIES:
            const actionUpdateCategories = actionAny as RefreshCategoriesAction;
            return actionUpdateCategories.categories;
        case ADD_CATEGORY:
            const actionAddCategory = actionAny as AddCategoryAction;
            state.push(actionAddCategory.category);
            return state;
        case EDIT_CATEGORY:
            const actionEditCategory = actionAny as EditCategoryAction;
            return state.map((category: CategoryState) => {
                if (category.category_id === actionEditCategory.category.category_id) {
                    return actionEditCategory.category;
                }
                return category;
            });
        case REMOVE_CATEGORY:
            const actionRemoveCategory = actionAny as RemoveCategoryAction;
            const removeCategoryState: CategoryState[] = [];
            for (const category of state) {
                if (category.category_id !== actionRemoveCategory.categoryID) {
                    removeCategoryState.push(category);
                }
            }
            return removeCategoryState;
        case ADD_CRITERIA:
            const actionAddCriteria = actionAny as AddCriteriaAction;
            return state.map((category: CategoryState) => {
                if (category.category_id === actionAddCriteria.criteria.category_id) {
                    category.criteria.push(actionAddCriteria.criteria);
                }

                return category;
            });
        case EDIT_CRITERIA:
            const actionEditCriteria = actionAny as EditCriteriaAction;
            return state.map((category: CategoryState) => {
                if (category.category_id === actionEditCriteria.criteria.category_id) {
                    category.criteria.map((criteria: CriteriaState) => {
                        if (criteria.criteria_id === actionEditCriteria.criteria.criteria_id) {
                            return actionEditCriteria.criteria;
                        }

                        return criteria;
                    });
                }

                return category;
            })
        case REMOVE_CRITERIA:
            const actionRemoveCriteria = actionAny as RemoveCriteriaAction;
            const removeCriteriaState: CategoryState[] = [];
            for (const category of state) {
                if (category.category_id === actionRemoveCriteria.categoryID) {
                    const criteriaState: CriteriaState[] = [];
                    for (const criteria of category.criteria) {
                        if (criteria.criteria_id !== actionRemoveCriteria.criteriaID) {
                            criteriaState.push(criteria);
                        }
                    }

                    category.criteria = criteriaState;
                }

                removeCriteriaState.push(category);
            }
        default:
            return state;
    }
}

export default categories;
