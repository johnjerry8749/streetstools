import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import {useNavigate,  NavLink} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const AppNavbar = () => {
  const [siteName, setSiteName] = useState("");
  const [sitelogo, setSiteLogo] = useState("");
  
  const navigate = useNavigate();

 useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/site-settings`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSiteName(data.sitename);
          setSiteLogo(data.sitelogo);
        }
      })
      .catch((error) => console.error("Error fetching site name:", error));
  }, []);


  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
      <Container>
        <Navbar.Brand to="/" className="fw-bold">
        <img 
            src={sitelogo} //admin Logo from database or public folder
            height="40"
            width="40"
            style={{borderRadius: '50%'}}
            className="me-2"
        />
        {siteName || "Site-Tools"} {/* Application Name */}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

         <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-left">
            <NavLink to="/" className="nav-link mx-2">Home</NavLink>
            <NavLink to="/product" className="nav-link mx-2">Product</NavLink>
            <NavLink to="/about" className="nav-link mx-2">About</NavLink>
            <NavLink to="/services" className="nav-link mx-2">Services</NavLink>
            <NavLink to="/contact" className="nav-link mx-2">Contact</NavLink>
            <Button 
              variant="outline-light" 
              size="sm" 
              className="ms-3"
              onClick={() => navigate('/Login')}
            >
              Sign In
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
