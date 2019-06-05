import React from 'react';
import User, { UserRole } from '../../types/User';
import { Menu, Responsive, Dropdown, DropdownDivider } from 'semantic-ui-react';
import { withRouter } from 'react-router';

interface NavigationProps {
    account: User;
    history: any;
    location: any;
    match: any;
}

const Navigation: React.FC<NavigationProps> = (props) => {
    const navTo = (link: string) => {
        props.history.push(link);
    };

    const generateNavigation = (role: UserRole, mobile: boolean) => {
        let leftNav: [string, string][] = [];

        switch (role) {
            case UserRole.Owner:
            case UserRole.Admin:
                leftNav = [
                    ['Home', '/'],
                    ['Judging', '/judging'],
                    ['Projects', '/projects'],
                    ['Admin', '/admin'],
                ];
                break;
            case UserRole.Judge:
                leftNav = [
                    ['Home', '/'],
                    ['Judging', '/judging'],
                    ['Projects', '/projects'],
                ];
                break;
            case UserRole.Pending:
                leftNav = [
                    ['Home', '/'],
                    ['Projects', '/projects'],
                ];
                break;
            default:
                leftNav = [
                    ['Projects', '/'],
                ]
                break;
        }

        return leftNav.map((navItem) => {
            if (mobile) {
                return (
                    <Dropdown.Item
                        key={navItem[0]}
                        active={navItem[1].length === 1
                            ? props.location.pathname === navItem[1]
                            : props.location.pathname.startsWith(navItem[1])}
                        onClick={() => navTo(navItem[1])}>{navItem[0]}</Dropdown.Item>
                )
            } else {
                return (
                    <Menu.Item
                        key={navItem[0]}
                        active={navItem[1].length === 1
                            ? props.location.pathname === navItem[1]
                            : props.location.pathname.startsWith(navItem[1])}
                        onClick={() => navTo(navItem[1])}>{navItem[0]}</Menu.Item>
                );
            }
        });
    };

    return (<>
        <Responsive minWidth={660}>
            <Menu size={'large'}>
                <Menu.Item><h3>HackGT Expo</h3></Menu.Item>
                {generateNavigation(props.account.role, false)}

                {props.account.role >= UserRole.Pending
                ?   <Menu.Menu key='divider' position='right'>
                        <Menu.Item
                            active={props.location.pathname.startsWith('/profile')}
                            onClick={() => navTo('/profile')}>Profile</Menu.Item>
                        <Menu.Item
                            active={props.location.pathname.startsWith('/logout')}
                            onClick={() => navTo('/logout')}>Logout</Menu.Item>
                    </Menu.Menu>

                :   <Menu.Menu position='right'>
                        <Menu.Item
                            active={props.location.pathname.startsWith('/login')}
                            onClick={() => navTo('/login')}>Login</Menu.Item>
                    </Menu.Menu>}
            </Menu>
        </Responsive>
        <Responsive maxWidth={659}>
            <Menu size={'large'}>
                <Menu.Item><h3>HackGT Expo</h3></Menu.Item>
                <Menu.Menu position='right'>
                    <Dropdown text='Menu' className='link item'>
                        <Dropdown.Menu>
                            {generateNavigation(props.account.role, true)}
                            <DropdownDivider />
                            {props.account.role >= UserRole.Pending
                            ?   <><Dropdown.Item
                                    active={props.location.pathname.startsWith('/profile')}
                                    onClick={() => navTo('/profile')}>Profile</Dropdown.Item>
                                <Dropdown.Item
                                    active={props.location.pathname.startsWith('/logout')}
                                    onClick={() => navTo('/logout')}>Logout</Dropdown.Item>
                                </>

                            :   <Dropdown.Item
                                    active={props.location.pathname.startsWith('/login')}
                                    onClick={() => navTo('/login')}>Login</Dropdown.Item>
                                }
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
        </Responsive>
    </>);
}

export default withRouter(Navigation);
