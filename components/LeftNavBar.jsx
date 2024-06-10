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
                        {user && user.data.adminID ? (
                            <>
                            <NavDropdown.Item href={`/createEvent`} className='sideNavDropdownOption'>Add Event</NavDropdown.Item>
                            <NavDropdown.Item href={`/`} className='sideNavDropdownOption'>Update Score Board</NavDropdown.Item>
                            </>
                        ):(
                            <NavDropdown.Item href={`/signin`} className='sideNavDropdownOption'>Admin</NavDropdown.Item>
                        )}
                    </NavDropdown>
            </Navbar>
    );
};

export default LeftNavBar;
