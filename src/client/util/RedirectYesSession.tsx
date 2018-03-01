import * as React from 'react';
import { Redirect } from 'react-router-dom';

interface YesSessionProps {}

const YesSession: React.SFC<YesSessionProps> = (props) => {
    return (
        <Redirect to='/' />
    );
};

export default YesSession;
