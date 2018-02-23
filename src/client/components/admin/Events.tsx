import * as React from 'react';
// import './Events.scss';

interface EventsProps {}

const Events: React.SFC<EventsProps> = (props) => {
    return (
        <div id='register-form'>
            <h1>Welcome!</h1>
            <p>You have been approved as a Events!</p>
        </div>
    );
};

export default Events;
