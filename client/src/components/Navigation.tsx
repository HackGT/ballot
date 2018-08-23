import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
    linkNames: string[];
    linkDests: string[];
}

interface NavigationElementProps {
    linkName: string;
    linkDest: string;
}

const Navigation: React.SFC<NavigationProps> = (props) => {
    const navLinks = [];
    for (let i = 0; i < props.linkNames.length; i++) {
        navLinks.push(<NavigationElement
            key={i}
            linkName={props.linkNames[i]}
            linkDest={props.linkDests[i]}/>);
    }

    navLinks.push(
        <li key={props.linkNames.length}>
            <a href='/auth/logout'>Logout</a>
        </li>
    );

    return (
        <nav className='nav'>
            <ul>{navLinks}</ul>
        </nav>
    );
};

const NavigationElement: React.SFC<NavigationElementProps> = (props) => {
    return (
        <li>
            <NavLink
            exact={props.linkDest === '/' ? true : false}
            activeClassName='active'
            to={props.linkDest}>{props.linkName}
            </NavLink>
        </li>
    );
};

export default Navigation;
