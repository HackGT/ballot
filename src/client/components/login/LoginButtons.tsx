import * as React from "react";
import './LoginButtons.scss';

class LoginButtons extends React.Component {
    render () {
        return (
            <div>
                {process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET ? <LoginButton name="Github" link="/auth/github/login" /> : ''}
                {process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET ? <LoginButton name="Facebook" link="/auth/facebook/login" /> : ''}
                {process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? <LoginButton name="Google" link="/auth/google/login" /> : ''}
            </div>
        )
    }
}

class LoginButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: this.props.name,
            link: this.props.link,
        }
    }

    render() {
        return (
            <div className="LoginButton">
                <a href={this.state.link}>Log in with {this.state.name}</a>
            </div>
        )
    }
}

export default LoginButtons;