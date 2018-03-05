import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../../util/authorization';

import AdminPage from '../../components/admin/AdminPage';

import { State } from '../../types/State';

interface StateToProps {}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const mapStateToAuth = (state: State): boolean => {
    return ['Admin', 'Owner'].includes(state.auth.role);
};

const AdminPageContainer = connect<StateToProps>(
    mapStateToAllProps<StateToProps, {}>(
        mapStateToProps,
        mapStateToAuth
    )
)(ConditionalRender(AdminPage));

export default AdminPageContainer;
