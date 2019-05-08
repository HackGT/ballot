import { connect } from 'react-redux';
import { AppState } from '../../state/Store';
import PageLogin from './PageLogin';
import { loginUser } from '../../state/UserAccount';
import User from '../../types/User';

const mapStateToProps = (state: AppState) => {
    return {
        account: state.account,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        loginUser: (user: User) => {
            dispatch(loginUser(user));
        }
    }
}

const PageLoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PageLogin);

export default PageLoginContainer;
