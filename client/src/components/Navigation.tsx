import React from 'react';
import User, { UserRole } from '../types/User';
import { Nav, Navbar } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const PATH_PROFILE = '/profile';
const PATH_LOGIN = '/login';
const PATH_LOGOUT = '/logout';

interface NavigationProps {
  account: User;
  match: any;
  location: any;
  history: any;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  const actualPage = () => {
    const pageString = props.location.pathname.split('/')[1];
    return pageString === '' ? '/' : `/${pageString}`;
  };

  const [curPage, changeCurPage] = React.useState(actualPage());

  React.useEffect(() => {
    changeCurPage(actualPage());
  }, [props.location]);

  const navTo = (route: string) => {
    props.history.push(route);
    changeCurPage(actualPage());
  };

  const genLeftNav = (role: UserRole) => {
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

    return (
      <Nav className="mr-auto">
      {leftNav.map((navItem) => {
        return (
          <Nav.Link
            key={navItem[0]}
            active={navItem[1] === curPage}
            onClick={() => navTo(navItem[1])}>
            {navItem[0]}
          </Nav.Link>
        );
      })}
      </Nav>
    )
  };

  let genRightNav = (role: UserRole) => {
    if (role >= UserRole.Pending) {
      return (
        <Nav>
          <Nav.Link
            active={PATH_PROFILE === curPage}
            onClick={() => navTo(PATH_PROFILE)}>
            Profile
          </Nav.Link>
          <Nav.Link
            active={PATH_LOGOUT === curPage}
            onClick={() => navTo(PATH_LOGOUT)}>
            Logout
          </Nav.Link>
        </Nav>
      );
    } else {
      return (
        <Nav>
          <Nav.Link
            active={PATH_LOGIN === curPage}
            onClick={() => navTo(PATH_LOGIN)}>
            Login
          </Nav.Link>
        </Nav>
      );
    }
  }

  return (
    <Navbar collapseOnSelect bg='dark' variant='dark' expand="sm">
      <Link
        to={'/'}
        style={{ textDecoration: 'none' }}
        onClick={() => navTo('/')}>
        <Navbar.Brand>HackGT Expo</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="navigation" />
      <Navbar.Collapse>
        {genLeftNav(props.account.role)}
        {genRightNav(props.account.role)}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default withRouter(Navigation);