import * as React from "react";
// import './Pending.scss';

class Pending extends React.Component {
    render() {
        return (
            <div>
                <h1>Welcome</h1>
                <h2>Your Status: Pending</h2>
                <p>You are fully registered! Now we just need to approve you before you can start judging.</p>

                <a href="/auth/logout">Click to logout</a>
            </div>
        )
    };
}

export default Pending