import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import { updateClass } from '../actions/profile';
import Action from '../types/Action';
import { State } from '../types/State';
import Login from '../components/login/Login';
import { UpdateClassRequestType } from '../types/UpdateClass';
import Logout from '../components/login/Logout';

interface DispatchToProps {
    updateClass: (json: UpdateClassRequestType) => void;
}

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const mapDispatchToProps = {
    updateClass,
};

const LoginContainer = connect<StateToProps, DispatchToProps>(
    mapStateToAllProps<StateToProps, {}>(mapStateToProps),
    mapDispatchToProps
)(ConditionalRender(Login));

export const LogoutContainer = connect<StateToProps, DispatchToProps>(
    mapStateToAllProps<StateToProps, {}>(mapStateToProps),
    mapDispatchToProps
)(ConditionalRender(Logout));

export default LoginContainer;
