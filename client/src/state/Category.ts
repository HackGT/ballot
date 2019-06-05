import Category, { Criteria } from '../types/Category';

export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const FILL_CATEGORIES = 'FILL_CATEGORIES';

export const ADD_CRITERIA = 'ADD_CRITERIA';
export const UPDATE_CRITERIA = 'UPDATE_CRITERIA';
export const DELETE_CRITERIA = 'DELETE_CRITERIA';

export interface CategoryState {
    [ id: number ]: Category;
}

export function updateCategory(category: Category) {
    return { type: UPDATE_CATEGORY, category };
}

export function deleteCategory(categoryID: number) {
    return { type: DELETE_CATEGORY, categoryID };
}

export function fillCategories(categories: { [id: number]: Category }) {
    return { type: FILL_CATEGORIES, categories };
}

export function updateCriteria(criteria: Criteria, categoryID: number) {
    return { type: UPDATE_CRITERIA, criteria };
}

export function deleteCriteria(criteriaID: number, categoryID: number) {
    return { type: DELETE_CRITERIA, criteriaID };
}

export default function categories(state: CategoryState = {}, action: any) {
    switch (action.type) {
        case UPDATE_CATEGORY:
            return {
                ...state,
                [action.category.id]: action.category,
            };
        case DELETE_CATEGORY:
            let {[action.categoryID]: omit, ...res} = state;
            return res;
        case FILL_CATEGORIES:
            const betterState: CategoryState = action.categories;
            // for (const category of action.categories) {
            //     betterState[category.id] = category;
            // }
            return betterState;
        case UPDATE_CRITERIA:
            return {
                ...state,
                [action.categoryID]: {
                    ...state[action.categoryID],
                    criteria: action.criteria,
                },
            };
        case DELETE_CRITERIA:
            const amazingState: CategoryState = {};
            const catCriteria = state[action.categoryID].criteria;
            for (let i = 0; i < catCriteria.length; i++) {
                if (catCriteria[i].id === action.criteriaID) {
                    amazingState[action.categoryID].criteria.splice(i, 1);
                }
            }
            return amazingState;
        default:
            return state;
    }
}
