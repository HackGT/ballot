import * as React from 'react';
import { Redirect } from 'react-router-dom';

interface NoSessionProps {}

const NoSession: React.SFC<NoSessionProps> = (props) => {
    return (
        <Redirect from='*' to='/login' />
    );
};

export default NoSession;
