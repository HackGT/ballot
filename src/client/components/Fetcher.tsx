import * as React from 'react';

interface FetcherProps {
    updateClass: () => void,
};

class Fetcher extends React.Component<FetcherProps> {
    componentWillMount() {
        this.props.updateClass();
    }

    render() {
        return null as JSX.Element;
    }
};

export default Fetcher;
