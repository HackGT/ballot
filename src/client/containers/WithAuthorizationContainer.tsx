import { connect } from 'react-redux';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { State } from '../types/State';

interface WithAuthorizationProps {
    allowedRoles: string[];
    WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
}

interface StateToProps {
    role: string;
}

const WithAuthorization: React.SFC<StateToProps & WithAuthorizationProps> = (props) => {
    const { allowedRoles, role, WrappedComponent } = props;
    if (allowedRoles.includes(role)) {
        return <WrappedComponent />;
    } else {
        return null;
    }
};

const mapStateToProps = (state: State): StateToProps => {
    return {
        role: state.auth.role,
    };
};

const WithAuthorizationContainer = connect<StateToProps>(
    mapStateToProps
)(WithAuthorization);

export default WithAuthorizationContainer;
