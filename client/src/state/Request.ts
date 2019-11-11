// Action Types
export const REQUEST_START = 'REQUEST_START';
export const REQUEST_FINISH = 'REQUEST_FINISH';

// Action Creators
export function requestStart() {
  return { type: REQUEST_START }
}

export function requestFinish() {
  return { type: REQUEST_FINISH }
}

export default function request(state: boolean = false, action: any) {
  switch (action.type) {
    case REQUEST_START:
      return true;
    case REQUEST_FINISH:
      return false;
    default:
      return state;
  }
}
