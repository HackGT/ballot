import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../../util/authorization';

import JudgeWrapper from '../../components/judging/JudgeWrapper';

import { State } from '../../types/State';

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const mapStateToAuth = (state: State): boolean => {
    return state.auth.role === 'Judge';
};

const JudgeContainer = connect<StateToProps>(
    mapStateToAllProps<StateToProps, {}>(
        mapStateToProps,
        mapStateToAuth
    )
)(ConditionalRender(JudgeWrapper));

export default JudgeContainer;
