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
    console.log('nosession', state.auth.role, !state.auth.role);
    return !state.auth.role;
};

interface NoSessionProps {}

const NoSession: React.SFC<NoSessionProps> = (props) => {
    return (
        <Redirect from='*' to='/login' />
    );
};

const NoSessionContainer = connect<StateToProps>(
    mapStateToAllProps(
        mapStateToProps,
        mapStateToAuth,
    ),
)(ConditionalRender(NoSession));

export default NoSessionContainer;
