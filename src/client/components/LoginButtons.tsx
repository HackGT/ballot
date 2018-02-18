import * as React from "react";

class LoginButtons extends React.Component {
    render () {
        return (
            <div>
                {process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? <a href="/auth/github/login">Login with Github</a> : ''}
                {process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET ? <a href="/auth/facebook/login">Login with Facebook</a> : ''}
                {process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? <a href="/auth/google/login">Login with Google</a> : ''}
            </div>
        )
    }
}

export default LoginButtons;