import { connect } from 'react-redux';
import Logout from './Logout';
import { logoutUser } from '../../state/UserAccount';

const mapDispatchToProps = (dispatch: any) => {
    return {
        logoutUser: () => {
            dispatch(logoutUser());
        }
    }
}

const LogoutContainer = connect(
    null,
    mapDispatchToProps,
)(Logout);

export default LogoutContainer;
