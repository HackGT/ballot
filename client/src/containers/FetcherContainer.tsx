import { connect } from 'react-redux';
import * as React from 'react';
import {
    ConditionalRender,
    mapStateToAllProps,
} from '../util/authorization';

import { fetchProfileClass } from '../actions/profile';
import Action from '../types/Action';
import { State } from '../types/State';

interface DispatchToProps {
    fetchProfileClass: () => void;
}

interface StateToProps {}

class Fetcher extends React.Component<DispatchToProps & StateToProps> {
    public componentWillMount(): void {
        this.props.fetchProfileClass();
    }

    public render(): React.ReactElement<any> | null {
        return null;
    }
}

const mapStateToProps = (state: State): StateToProps => {
    return {};
};

const mapDispatchToProps = {
    fetchProfileClass,
};

const FetcherContainer = connect<StateToProps, DispatchToProps>(
    mapStateToAllProps<StateToProps, {}>(mapStateToProps),
    mapDispatchToProps
)(ConditionalRender(Fetcher));

export default FetcherContainer;
