import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import GeneralWrapper from '../components/GeneralWrapper';

import { State } from '../types/State';

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const mapStateToAuth = (state: State): boolean => {
    return state.auth.role === 'None';
};

const GeneralWrapperContainer = connect<StateToProps>(
    mapStateToAllProps<StateToProps, {}>(
        mapStateToProps,
        mapStateToAuth
    )
)(ConditionalRender(GeneralWrapper));

export default GeneralWrapperContainer;
