import * as React from 'react';
import { Redirect } from 'react-router-dom';

class NoSession extends React.Component {
    render() {
        return (
            <Redirect from="*" to="/login" />
        )
    };
}

export default NoSession