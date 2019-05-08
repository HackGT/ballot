import { connect } from 'react-redux';
import { AppState } from '../state/Store';
import PageHome from './PageHome';

const mapStateToProps = (state: AppState) => {
    return {
        account: state.account,
    };
};

const PageHomeContainer = connect(mapStateToProps)(PageHome);

export default PageHomeContainer;
