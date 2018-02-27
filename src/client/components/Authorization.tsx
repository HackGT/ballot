import * as React from 'react';
import { Redirect } from 'react-router-dom';

import WithAuthorizationContainer from '../containers/WithAuthorizationContainer';

const Authorization =
    (allowedRoles: string[]) =>
        (WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => {
            const Component = () => {
                return <WithAuthorizationContainer
                    allowedRoles={allowedRoles}
                    WrappedComponent={WrappedComponent} />;
            };

            return Component;
        };

export default Authorization;
