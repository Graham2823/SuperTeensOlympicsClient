import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import "@/app/app.css";

const LeftNavBar = ({}) => {

    return (
            <Navbar expand="lg" className="leftNav" style={{float:'left', marginLeft:'100px'}}>
                    <NavDropdown title={<span>SuperTeens</span>} id="basic-nav-dropdown">
                        <NavDropdown.Item href={`/`} className='sideNavDropdownOption'>Home</NavDropdown.Item>
                        <NavDropdown.Item href={`/`} className='sideNavDropdownOption'>Schedule</NavDropdown.Item>
                        <NavDropdown.Item href={`/`} className='sideNavDropdownOption'>Admin</NavDropdown.Item>
                    </NavDropdown>
            </Navbar>
    );
};

export default LeftNavBar;
