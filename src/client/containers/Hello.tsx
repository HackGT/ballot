import Hello from '../components/Hello';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ numberLevel, languageName }: StoreState) {
    return {
        bestNumber: numberLevel,
        name: languageName,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.NumberAction>) {
    return {
        onIncrement: () => dispatch(actions.incrementNumber()),
        onDecrement: () => dispatch(actions.decrementNumber()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hello);