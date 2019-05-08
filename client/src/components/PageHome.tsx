import React from 'react';
import User, { UserRole, getRoleName } from '../types/User';

interface PageHomeProps {
    account: User;
}

const PageHome: React.FC<PageHomeProps> = (props) => {
    switch (props.account.role) {
        case UserRole.Owner:
        case UserRole.Admin:
            return (
                <div></div>
            )
        case UserRole.Judge:
        case UserRole.Pending:
        default:
            return <div>Display Project Table Here</div>
    }
}

interface GreetingProps {
    account: User;
}

const Greeting: React.FC<GreetingProps> = (props) => {
    return (
        <>
            <h1>Welcome to Ballot!</h1>
            <em>Your Status: {getRoleName(props.account.role)}</em>
        </>
    )
}

export default PageHome;
