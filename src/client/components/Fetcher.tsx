import * as React from 'react';

interface FetcherProps {
    updateClass: (classJson: any) => void,
};

class Fetcher extends React.Component<FetcherProps> {
    componentWillMount() {
        fetch('/auth/user_data/class', {
            credentials: 'same-origin',
        }).then(result => result.json())
          .then(this.props.updateClass);
    }

    render() {
        return null as JSX.Element;
    }
};

export default Fetcher;
