import { connect } from 'react-redux';
import App from './App';
import { AppState } from './state/Store';
import { loginUser } from './state/UserAccount';
import User from './types/User';

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

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
