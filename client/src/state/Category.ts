import Category, { Criteria, CategoryState, CategoryCriteriaState, CriteriaState } from '../types/Category';
import Axios from 'axios';

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

export function fetchCategories() {
  return async (dispatch: any) => {
    try {
      const result = await Axios.get('/api/categories/allCategoriesCriteria');
      if (result.status) {
        const payload: CategoryState = result.data;
        dispatch(fillCategories(payload));
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  };
}

export default function categories(state: CategoryCriteriaState = {
  criteria: {},
  categories: {}
}, action: any) {
  switch (action.type) {
    case UPDATE_CATEGORY:
      return {
        ...state,
        categories: {
          ...state.categories,
          ...action.categories,
        },
      };
    case DELETE_CATEGORY:
      let {[action.categoryID]: omitCategory, ...resCategory} = state.categories;
      return {
        ...state,
        categories: resCategory,
      };
    case FILL_CATEGORIES:
      const criteriaState: CriteriaState = {};
      const categoryState: CategoryState = action.categories;
      for (const cat of Object.values(categoryState)) {
        const category: Category = cat;
        for (const cri of Object.values(category.criteria)) {
          const criteria: Criteria = cri;
          criteriaState[criteria.id!] = {
            ...criteria,
            categoryID: category.id!,
          };
        }
      }
      return {
        criteria: criteriaState,
        categories: action.categories,
      };
    case UPDATE_CRITERIA:
      return {
        categories: {
          ...state.categories,
          [action.critera.categoryID]: {
            ...state.categories[action.critera.categoryID],
            criteria: {
              ...action.criteria,
            },
          }
        },
        criteria: {
          ...state.criteria,
          ...action.criteria,
        },
      };
    case DELETE_CRITERIA:
      let {[action.criteriaID]: omitCCriteria, ...resCCriteria} = state.categories[state.criteria[action.criteriaID].categoryID].criteria;
      let {[action.criteriaID]: omitCriteria, ...resCriteria} = state.criteria;
      return {
        categories: {
          ...state.categories,
          [action.criteria.categoryID]: {
            critera: resCCriteria,
          },
        },
        criteria: resCriteria,
      };
    case FILL_CRITERIA:
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.criteria.categoryID]: {
            ...state.categories[action.criteria.categoryID],
            criteria: action.criteria,
          },
        },
        criteria: {
          ...state.criteria,
          ...action.criteria,
        },
      };
    default:
      return state;
  }
}
