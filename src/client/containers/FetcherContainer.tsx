import { connect } from 'react-redux';
import Fetcher from '../components/Fetcher';

import { updateClass } from '../actions/Fetcher';
import Action from '../types/Action';
import { State } from '../types/State';

const mapStateToProps = (state: State) => {
    return {};
};

const mapDispatchToProps = (dispatch: (action: Action) => void) => {
    return {
        updateClass: () => {
            fetch('/auth/user_data/class', {
                credentials: 'same-origin',
            }).then(result => result.json())
              .then(updateClass)
              .then(dispatch);
        },
    };
};

const FetcherContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Fetcher);

export default FetcherContainer;