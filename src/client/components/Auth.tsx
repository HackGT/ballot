import * as React from 'react';
import { Redirect } from 'react-router-dom';

const Authorization = (allowedRoles: string[]) => (WrappedComponent: React.ComponentClass) => {
    return class WithAuthorization extends React.Component<{}, { user: {role: string} }> {
        constructor(props: any) {
            super(props);

            this.state = {
                user: {
                    role: 'About',
                }
            };
        }

        async componentDidMount() {
            const self = this;
            const userModel = ['Pending', 'Judge', 'Admin', 'Owner', 'None'];
            let result = await fetch('/auth/user_data/class', {
                credentials: "same-origin",
            });
            let data = await result.json();
            if (data.a) {
                self.setState({user: {role: userModel[data.a]}});
            }
        }

        render() {
            const { role } = this.state.user;
            if (allowedRoles.indexOf(role) > -1) {
                return <WrappedComponent {...this.props} />;
            } else {
                return '';
            }
        }
    }
}

export default Authorization;