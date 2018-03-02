import * as React from 'react';
// import './Header.scss';

interface HeaderProps {}

const Header: React.SFC<HeaderProps> = (props) => {
    return (
        <div>
            <h1>Ballot @ HackGT</h1>
        </div>
    );
};

export default Header;
