import { connect } from 'react-redux';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import { State, AuthState } from '../types/State';

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {
        auth: state.auth,
    };
};

const mapStateToAuth = (state: State): boolean => {
    return state.auth.role !== 'None';
};

interface YesSessionProps {
    auth: AuthState;
}

const YesSession: React.SFC<YesSessionProps> = (props) => {
    if (props.auth.role === null || props.auth.role === 'None') {
        return null;
    }

    return (
        <Redirect to='/' />
    );
};

const YesSessionContainer = connect<StateToProps>(
    mapStateToAllProps(
        mapStateToProps,
        mapStateToAuth
    )
)(ConditionalRender(YesSession));

export default YesSessionContainer;
