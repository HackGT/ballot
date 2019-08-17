import Category, { Criteria, CategoryState } from '../types/Category';

export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const FILL_CATEGORIES = 'FILL_CATEGORIES';

export const UPDATE_CRITERIA = 'UPDATE_CRITERIA';
export const DELETE_CRITERIA = 'DELETE_CRITERIA';
export const FILL_CRITERIA = 'FILL_CRITERIA';

export function updateCategory(categories: CategoryState) {
  return { type: UPDATE_CATEGORY, categories };
}

export function deleteCategory(categoryID: number) {
  return { type: DELETE_CATEGORY, categoryID };
}

export function fillCategories(categories: { [id: number]: Category }) {
  return { type: FILL_CATEGORIES, categories };
}

export function updateCriteria(criteria: Criteria) {
  return { type: UPDATE_CRITERIA, criteria };
}

export function deleteCriteria(criteriaID: number) {
  return { type: DELETE_CRITERIA, criteriaID };
}

export function fillCriteria(criteria: { [id: number]: Criteria }) {
  return { type: FILL_CRITERIA, criteria };
}

export default function categories(state: CategoryState = {}, action: any) {
  switch (action.type) {
    case UPDATE_CATEGORY:
      return {
        ...state,
        ...action.categories,
      };
    case DELETE_CATEGORY:
      let {[action.categoryID]: omitCategory, ...resCategory} = state;
      return resCategory;
    case FILL_CATEGORIES:
      return action.categories;
    case UPDATE_CRITERIA:
      return {
        ...state,
        [action.criteria.id]: action.criteria,
      };
    case DELETE_CRITERIA:
      let {[action.criteriaID]: omitCriteria, ...resCriteria} = state;
      return resCriteria;
    case FILL_CRITERIA:
      return action.criteria;
    default:
      return state;
  }
}
