import * as React from 'react';
import { State } from '../types/State';

export const mapStateToAllProps = <PropsType extends object, OwnPropsType>(
    mapStateToProps: (state: State, ownProps: OwnPropsType | undefined) => PropsType,
    mapStateToAuth?: (state: State, ownProps: OwnPropsType | undefined) => boolean,
) => (state: State, ownProps: OwnPropsType) => ({
        // typescript is garbage exhibit A
        // https://github.com/Microsoft/TypeScript/issues/14409
        ...(mapStateToProps(state, ownProps) as object),
        __render: mapStateToAuth ? mapStateToAuth(state, ownProps) : true,
    });

export const ConditionalRender = (
    WrappedComponent: React.ComponentClass<any> |React.StatelessComponent<any>
    // typescript is garbage exhibit B
    // https://github.com/Microsoft/TypeScript/issues/4922
) => <PropsType extends any>(props: PropsType) => {
    if (props.__render) {
        return <WrappedComponent {...props} />;
    } else {
        // typescript is garbage exhibit C
        // https://github.com/Microsoft/TypeScript/issues/11566
        return null as JSX.Element;
    }
};