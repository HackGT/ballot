import * as React from 'react';
import { NavLink, match, Link, withRouter } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Popover, Button, Position, Menu, MenuItem, Navbar, Alignment, H1, NavbarDivider, ButtonGroup } from '@blueprintjs/core';

interface NavigationProps {
    linkNames: string[];
    linkDests: string[];
    hasSession: boolean;
    match: any;
    history: any;
    location: any;
}

interface NavigationElementProps {
    mobile: boolean;
    location: any;
    history: any;
    linkName: string;
    linkDest: string;
}

const Navigation: React.SFC<NavigationProps> = (props) => {
    const navLinks = [];
    const navLinksMobile = [];
    for (let i = 0; i < props.linkNames.length; i++) {
        navLinks.push(<NavigationElement
            key={i}
            location={props.location}
            history={props.history}
            mobile={false}
            linkName={props.linkNames[i]}
            linkDest={props.linkDests[i]}/>);

        navLinksMobile.push(<NavigationElement
            key={i}
            location={props.location}
            history={props.history}
            mobile={true}
            linkName={props.linkNames[i]}
            linkDest={props.linkDests[i]}/>);
    }

    if (props.hasSession) {
        navLinks.push(
            <NavigationElement
                key={props.linkNames.length}
                location={props.location}
                history={props.history}
                mobile={false}
                linkName={'Logout'}
                linkDest={'/logout'}
            />
        );

        navLinksMobile.push(
            <NavigationElement
                key={props.linkNames.length}
                location={props.location}
                history={props.history}
                mobile={true}
                linkName={'Logout'}
                linkDest={'/logout'}
            />
        );
    }


    return (
        <div>
            <MediaQuery query='(min-width: 441px)'>
                <Navbar style={{ maxWidth: 960 }}>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading><strong><h2>Ballot</h2></strong></Navbar.Heading>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <ButtonGroup>
                            {navLinks}
                        </ButtonGroup>
                    </Navbar.Group>
                </Navbar>
            </MediaQuery>

            <MediaQuery query='(max-width: 440px)'>
                <Navbar>
                    <Navbar.Group>
                        <Navbar.Heading><strong><h2>Ballot</h2></strong></Navbar.Heading>
                        <NavbarDivider />
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <Popover
                            content={<Menu>{navLinksMobile}</Menu>}
                            position={Position.BOTTOM_RIGHT}>
                            <Button icon="menu" large={true} text='Menu' minimal={true} />
                        </Popover>
                    </Navbar.Group>
                </Navbar>
            </MediaQuery>
        </div>
    );
};

const NavigationElement: React.SFC<NavigationElementProps> = (props) => {
    if (props.mobile) {
        return (
            <MenuItem
                onClick={() => {
                    props.history.push(props.linkDest);
                }}
                text={props.linkName}
                active={props.location.pathname === props.linkDest} />
        )
    } else {
        return (
            <Button
                onClick={() => {
                    props.history.push(props.linkDest);
                }}
                style={{ outline: 'none' }}
                active={props.location.pathname === props.linkDest}
                text={props.linkName} />
        );
    }
};

export default withRouter(Navigation);
