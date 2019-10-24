import Axios from "axios";

export const UPDATE_COMPANIES = 'UPDATE_COMPANIES';

export function updateCompanies(companies: string[]) {
  return { type: UPDATE_COMPANIES, companies };
}

export function fetchCompanies() {
  return async (dispatch: any) => {
    try {
      const result = await Axios.get('/api/categories/companies');
      if (result.status) {
        const payload: string[] = result.data;
        dispatch(updateCompanies(payload));
      } else {
        throw new Error('API Error');
      }
    } catch (error) {
      console.log(error);
      return Promise.resolve();
    }
  };
}

export default function companies(state: string[] = [], action: any) {
  switch (action.type) {
    case UPDATE_COMPANIES:
      return action.companies;
    default:
      return state;
  }
}
