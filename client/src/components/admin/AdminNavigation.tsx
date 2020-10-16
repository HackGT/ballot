import React from 'react';
import { withRouter } from 'react-router';
import { Nav } from 'react-bootstrap';
import { adminRoute } from './PageAdmin';

interface AdminNavigationProps {
  history: any;
  location: any;
  match: any;
}

const AdminNavigation: React.FC<AdminNavigationProps> = (props) => {
  const actualPage = () => {
    const pageString = props.location.pathname.split('/')[2];
    return pageString ? `/${pageString}` : '/';
  };

  const [curPage, changeCurPage] = React.useState(actualPage());

  React.useEffect(() => {
    changeCurPage(actualPage());
  });

  const navTo = (link: string) => {
    props.history.push(link);
    changeCurPage(actualPage());
  };

  return (
    <Nav
      variant='tabs'
      activeKey={curPage}>
      <Nav.Item>
        <Nav.Link
          eventKey={`/`}
          onClick={() => navTo(`${adminRoute}`)}>
          Projects
        </Nav.Link>
      </Nav.Item>
      {/* <Nav.Item>
        <Nav.Link
          eventKey={`/projects`}
          onClick={() => navTo(`${adminRoute}/projects`)}>
          Projects
        </Nav.Link>
      </Nav.Item> */}
      <Nav.Item>
        <Nav.Link
          eventKey={`/categories`}
          onClick={() => navTo(`${adminRoute}/categories`)}>
          Categories
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey={`/users`}
          onClick={() => navTo(`${adminRoute}/users`)}>
          Users
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey={`/dashboard`}
          onClick={() => navTo(`${adminRoute}/dashboard`)}>
          Dashboard
        </Nav.Link>
      </Nav.Item>
    </Nav>
    // <Menu pointing secondary>
    //   <Menu.Item
    //     active={props.location.pathname === '/admin'}
    //     onClick={() => navTo('/admin')}>Epicenter</Menu.Item>
    //   <Menu.Item
    //     active={props.location.pathname.startsWith('/admin/projects')}
    //     onClick={() => navTo('/admin/projects')}>Projects</Menu.Item>
    //   <Menu.Item
    //     active={props.location.pathname.startsWith('/admin/categories')}
    //     onClick={() => navTo('/admin/categories')}>Categories</Menu.Item>
    //   <Menu.Item
    //     active={props.location.pathname.startsWith('/admin/users')}
    //     onClick={() => navTo('/admin/users')}>Users</Menu.Item>
    // </Menu>
  );
}

export default withRouter(AdminNavigation);