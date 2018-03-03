import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import App from '../components/App';

import { State } from '../types/State';

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const AppContainer = connect<StateToProps>(
    mapStateToAllProps<StateToProps, {}>(mapStateToProps),
)(ConditionalRender(App));

export default AppContainer;
