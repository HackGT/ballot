export default interface Category {
  id?: number;
  name: string;
  isDefault: boolean;
  generated: boolean;
  description: string;
  criteria: CriteriaState;
}

export interface Criteria {
  id?: number;
  name: string;
  rubric: string;
  minScore: number;
  maxScore: number;
  categoryID: number;
}

export interface CategoryState {
  [ id: number ]: Category;
}

export interface CriteriaState {
  [ id: number ]: Criteria;
}

export interface NameToCategoryMapping {
  [ categoryName: string]: Category;
}

const createPlaceholderCriteria = () => {
	const criteriaDict: { [id: number]: Criteria} = {};
	criteriaDict[-1] = createEmptyCriteria(-1);
	return criteriaDict;
};

export const EMPTY_CATEGORY = {
  name: '',
  isDefault: false,
  generated: false,
  description: '',
  criteria: createPlaceholderCriteria(),
};

export function createEmptyCriteria(id: number) {
  return {
    id,
		name: '',
		rubric: '',
		minScore: 1,
		maxScore: 10,
		categoryID: -1,
  };
}
