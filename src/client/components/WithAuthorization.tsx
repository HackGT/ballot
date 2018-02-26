import * as React from 'react';
import { Redirect } from 'react-router-dom';

interface WithAuthorizationProps {
    allowedRoles: string[],
    role: string,
    WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>,
};

const WithAuthorization: React.SFC<WithAuthorizationProps> = (props: WithAuthorizationProps) => {
    const { allowedRoles, role, WrappedComponent } = props;

    if (allowedRoles.includes(role)) {
        return <WrappedComponent />;
    } else {
        return null;
    }
};

export default WithAuthorization;
