import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarNavigation.css';

interface NavigationElementProps {
    linkName: string;
    linkDest: string;
    match: any;
}

interface NavigationProps {
    linkNames: string[];
    linkDests: string[];
    match: any;
}

const Navigation: React.SFC<NavigationProps> = (props) => {
    const navLinks: any[] = [];

    for (let i = 0; i < props.linkNames.length; i++) {
        navLinks.push(<NavigationElement
            key={i}
            linkName={props.linkNames[i]}
            linkDest={props.linkDests[i]}
            match={props.match}/>);
    }

    return (
        <nav className='sidebar-nav'>
        <ul>{navLinks}</ul>
        </nav>
    );
};

const NavigationElement: React.SFC<NavigationElementProps> = (props) => {
    return (
        <li>
            <NavLink
            exact
            activeClassName='active'
            to={props.match.url + props.linkDest}>
                {props.linkName}
            </NavLink>
        </li>
    );
};

export default Navigation;
