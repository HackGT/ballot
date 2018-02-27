import { connect } from 'react-redux';
import WithAuthorization from '../components/WithAuthorization';
import { State } from '../types/State';

interface WithAuthorizationContainerProps {
    allowedRoles: string[],
    WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>,
};

const mapStateToProps = (state: State, ownProps: WithAuthorizationContainerProps) => {
    return {
        allowedRoles: ownProps.allowedRoles,
        role: state.auth.role,
        WrappedComponent: ownProps.WrappedComponent,
    };
};

const WithAuthorizationContainer = connect(
    mapStateToProps,
)(WithAuthorization);

export default WithAuthorizationContainer;