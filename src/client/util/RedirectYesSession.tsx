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
    return state.auth.role !== 'None';
};

interface YesSessionProps {}

const YesSession: React.SFC<YesSessionProps> = (props) => {
    return (
        <Redirect to='/' />
    );
};

const YesSessionContainer = connect<StateToProps>(
    mapStateToAllProps(
        mapStateToProps,
        mapStateToAuth,
    ),
)(ConditionalRender(YesSession));

export default YesSessionContainer;
