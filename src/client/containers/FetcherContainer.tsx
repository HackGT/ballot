import { connect } from 'react-redux';
import Fetcher from '../components/Fetcher';

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: (action: any) => void) => {
    return {
        updateClass: (classJson: any) => {
            dispatch({
                type: 'UPDATE_CLASS',
                role: classJson.a,
            });
        },
    };
};

const FetcherContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Fetcher);

export default FetcherContainer;