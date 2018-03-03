import * as React from 'react';
import { State } from '../types/State';

export const mapStateToAllProps = (mapStateToProps, mapStateToAuth) => {
    return (state: State, ownProps) => ({
        ...mapStateToProps(state, ownProps),
        __render: mapStateToAuth ? mapStateToAuth(state, ownProps) : true,
    });
};

export const ConditionalRender = (WrappedComponent) => (props) => {
    if (props.__render) {
        return <WrappedComponent {...props} />;
    } else {
        return null as JSX.Element;
    }
};