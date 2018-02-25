import * as React from 'react';
import { Link } from 'react-router-dom';
import './SidebarNavigation.scss';

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
        navLinks.push(<NavigationElement key={i} linkName={props.linkNames[i]} linkDest={props.linkDests[i]}/>);
    }

    return (
        <nav className='sidebar-nav'>
            <ul>{navLinks}</ul>
        </nav>
    );
};

const NavigationElement: React.SFC<NavigationElementProps> = (props) => {
    return (
        <li><Link to={props.linkDest}>{props.linkName}</Link></li>
    );
};

export default Navigation;
