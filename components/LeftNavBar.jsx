import React, {useContext} from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import "@/app/app.css";
import { UserContext } from '@/context/userContext';

const LeftNavBar = ({}) => {
    const {user} = useContext(UserContext)

    return (
            <Navbar expand="lg" className="leftNav">
                    <NavDropdown title={<span>SuperTeens</span>} id="basic-nav-dropdown">
                        <NavDropdown.Item href={`/`} className='sideNavDropdownOption'>Home</NavDropdown.Item>
                        <NavDropdown.Item href={`/schedule`} className='sideNavDropdownOption'>Schedule</NavDropdown.Item>
                        <NavDropdown.Item href={`/about`} className='sideNavDropdownOption'>About SuperTeens</NavDropdown.Item>
                        {user && user.adminID && (
                            <>
                            <NavDropdown.Item href={`/createEvent`} className='sideNavDropdownOption'>Add Event</NavDropdown.Item>
                            <NavDropdown.Item href={`/updateScoreBoard`} className='sideNavDropdownOption'>Update Score Board</NavDropdown.Item>
                            </>
                        )}
                    </NavDropdown>
            </Navbar>
    );
};

export default LeftNavBar;
