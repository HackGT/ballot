import User from '../types/User';

// Action Types
export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const FILL_USERS = 'FILL_USERS';

// Action Creators
export function addUser(newUser: User) {
  return { type: ADD_USER, user: newUser };
}

export function deleteUser(userID: number) {
  return { type: DELETE_USER, id: userID };
}

export function updateUser(updatedUser: User) {
  return { type: UPDATE_USER, user: updatedUser };
}

export function fillUsers(users: UserState) {
  return { type: FILL_USERS, users }
}

export interface UserState {
  [id: number]: User
}

// Reducer
export default function users(state: UserState = {}, action: any) {
  switch (action.type) {
    case ADD_USER:
    case UPDATE_USER:
      return {
        ...state,
        [action.user.id]: action.user,
      };
    case DELETE_USER:
      const newState = state;
      delete newState[action.id];
      return newState;
    case FILL_USERS:
      return action.users;
    default:
      return state;
  }
}