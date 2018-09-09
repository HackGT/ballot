import * as React from 'react';
import { Callout, H1 } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import StatusContainer from '../../containers/StatusContainer';

const PendingContent: React.SFC<{}> = (props) => {
    return (
        <div>
            <Callout
                title='Pending Confirmation'
                intent='warning'
                style={{
                    width: '90%',
                    margin: '0 auto 10px',
                }}>
                You have not yet been confirmed. Please contact the "Epicenter" to start judging.
            </Callout>

            <StatusContainer />
        </div>
    )
}

export default PendingContent;
