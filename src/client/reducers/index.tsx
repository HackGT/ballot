import { NumberAction } from '../actions';
import { StoreState } from '../types/index';
import { INCREMENT_NUMBER, DECREMENT_NUMBER } from '../constants/index';

export function number(state: StoreState, action: NumberAction): StoreState {
    switch (action.type) {
        case INCREMENT_NUMBER:
            return { ...state, numberLevel: state.numberLevel + 1 };
        case DECREMENT_NUMBER:
            return { ...state, numberLevel: Math.max(1, state.numberLevel - 1) };
        default:
            return state;
    }
}