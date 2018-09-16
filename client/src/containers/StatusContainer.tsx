import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import { updateClass } from '../actions/profile';
import Action from '../types/Action';
import { State, AuthState } from '../types/State';
import Status from '../components/Status';
import { UpdateClassRequestType } from '../types/UpdateClass';
import AdminPanelUsers from '../components/admin/AdminPanelUsers';

interface DispatchToProps {}

interface StateToProps {
    auth: AuthState;
}

const mapStateToProps = (state: State): StateToProps => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = {};

const StatusContainer = connect<StateToProps, DispatchToProps>(
    mapStateToProps,
    mapDispatchToProps
)(Status);

export default StatusContainer;
