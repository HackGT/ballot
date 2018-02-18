import * as React from "react";
// import './Pending.scss';

class Pending extends React.Component {
    render() {
        return (
            <div>
                <h1>Pending</h1>
                <p>You are fully registered! Now we just need to approve you before you can start judging.</p>
                <a href="/auth/user_data">Click for data</a>
                <a href="/auth/logout">Click to logout</a>
            </div>
        )
    };
}

export default Pending