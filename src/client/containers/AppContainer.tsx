import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import Pending from '../components/Pending';

import { State } from '../types/State';

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const mapStateToAuth = (state: State): boolean => {
    return ['Pending', 'Judge', 'Admin', 'Owner'].includes(state.auth.role);
};

const PendingContainer = connect<StateToProps>(
    mapStateToAllProps(
        mapStateToProps,
        mapStateToAuth,
    ),
)(ConditionalRender(Pending));

export default PendingContainer;
