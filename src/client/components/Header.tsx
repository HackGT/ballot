import * as React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

interface HeaderProps {}

const Header: React.SFC<HeaderProps> = (props) => {
    return (
        <div className='header'>
            <h1><Link to='/'>Ballot @ HackGT</Link></h1>
        </div>
    );
};

export default Header;
