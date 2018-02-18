import * as React from 'react';
import { Redirect } from 'react-router-dom';

class YesSession extends React.Component {
    render() {
        return (
            <Redirect to="/" />
        )
    };
}

export default YesSession