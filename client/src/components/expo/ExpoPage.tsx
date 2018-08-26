import * as React from 'react';
// import './Judging.css';
import { ExpoContainer } from '../../containers/expo/ExpoContainer';

interface ExpoPage {}

const ExpoPage: React.SFC<ExpoPage> = (props) => {
    return (
        <ExpoContainer />
    );
};

export default ExpoPage;
