import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import PendingWrapper from '../components/PendingWrapper';

import { State } from '../types/State';

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const mapStateToAuth = (state: State): boolean => {
    return state.auth.role === 'Pending';
};

const PendingWrapperContainer = connect<StateToProps>(
    mapStateToAllProps<StateToProps, {}>(
        mapStateToProps,
        mapStateToAuth
    )
)(ConditionalRender(PendingWrapper));

export default PendingWrapperContainer;
