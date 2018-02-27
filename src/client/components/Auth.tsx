import * as React from 'react';
import { Redirect } from 'react-router-dom';

const Authorization = (allowedRoles: string[]) => (WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => {
    return class WithAuthorization extends React.Component<{}, { user: {role: string} }> {
        constructor(props: any) {
            super(props);

            this.state = {
                user: {
                    role: '',
                },
            };
        }

        public async componentDidMount(): Promise<void> {
            const self = this;
            const userModel = ['Pending', 'Judge', 'Admin', 'Owner'];
            const result = await fetch('/auth/user_data/class', {
                credentials: 'same-origin',
            });
            const data = await result.json();
            if (userModel.includes(data.a)) {
                self.setState({user: {role: data.a}});
            } else {
                self.setState({user: {role: 'None'}});
            }
        }

        public render(): React.ReactElement<any> {
            const { role } = this.state.user;
            if (allowedRoles.includes(role)) {
                return <WrappedComponent {...this.props} />;
            } else {
                return null;
            }
        }
    };
};

export default Authorization;
