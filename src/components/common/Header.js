import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../AuthContext';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    const username = localStorage.getItem('currentUsername');
    const uuid = localStorage.getItem('uuid');
    const shortUuid = uuid ? uuid.substring(0, 6) : '';

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
            <Navbar.Brand className="mx-auto">Xkeystroke</Navbar.Brand>
            {isAuthenticated && !isAuthPage && (
                <>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Link to="/" className="nav-link">Dashboard</Link>
                            <Link to="/report-panel" className="nav-link">Report Panel</Link>
                            <Link to="/file-scanner" className="nav-link">File Scanner</Link>
                            <Link to="/active-accounts" className="nav-link">Active Accounts</Link>
                            {localStorage.getItem('role') === 'admin' && (
                                <Link to="/users" className="nav-link">Users</Link>
                            )}
                            <NavDropdown title="More" id="more-nav-dropdown" alignRight>
                                <Link to="/active-reports" className="dropdown-item">Active Reports</Link>
                                <Link to="/open-captcha" className="dropdown-item">Open Captcha</Link>
                                <Link to="/workflow" className="dropdown-item">Workflow</Link>
                                <Link to="/api" className="dropdown-item">API</Link>
                                <Link to="/proxies" className="dropdown-item">Proxies</Link>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <NavDropdown title={<><span className="short-uuid">{shortUuid}</span> Profile</>} id="basic-nav-dropdown" alignRight>
                                <Link to="/profile" className="dropdown-item">View Profile</Link>
                                <Link to="/settings" className="dropdown-item">Settings</Link>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </>
            )}
        </Navbar>
    );
};

export default Header;
