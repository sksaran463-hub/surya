import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <span className="logo-icon">🚗</span>
                    <span className="logo-text">ANPR System</span>
                </div>
                <ul className="navbar-menu">
                    <li>
                        <Link
                            to="/"
                            className={location.pathname === '/' ? 'active' : ''}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/history"
                            className={location.pathname === '/history' ? 'active' : ''}
                        >
                            History
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
