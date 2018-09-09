import * as React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {}

const Header: React.SFC<HeaderProps> = (props) => {
    return (
        <h1><Link to='/'>HackGT: Ballot</Link></h1>
    );
};

export default Header;
