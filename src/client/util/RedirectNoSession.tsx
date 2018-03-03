import { connect } from 'react-redux';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import { State } from '../types/State';

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const mapStateToAuth = (state: State): boolean => {
    return state.auth.role === 'None';
};

interface NoSessionProps {}

const NoSession: React.SFC<NoSessionProps> = (props) => {
    return (
        <Redirect to="/login" />
    );
};

const NoSessionContainer = connect<StateToProps>(
    mapStateToAllProps(
        mapStateToProps,
        mapStateToAuth,
    ),
)(ConditionalRender(NoSession));

export default NoSessionContainer;
