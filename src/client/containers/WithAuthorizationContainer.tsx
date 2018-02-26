import { connect } from 'react-redux';
import WithAuthorization from '../components/WithAuthorization';

interface WithAuthorizationContainerProps {
    allowedRoles: string[],
    WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>,
};

const mapStateToProps = (state: any, ownProps: WithAuthorizationContainerProps) => {
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