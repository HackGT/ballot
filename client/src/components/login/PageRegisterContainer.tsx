import { connect } from 'react-redux';
import { AppState } from '../../state/Store';
import PageRegister from './PageRegister';

const mapStateToProps = (state: AppState) => {
    return {
        account: state.account,
    };
};

const AppContainer = connect(mapStateToProps)(PageRegister);

export default AppContainer;
