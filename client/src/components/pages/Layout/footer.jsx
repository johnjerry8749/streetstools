import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  const [siteName, setSiteName] = useState("");
  const [siteLogo, setSiteLogo] = useState("");
  const [siteEmail, setSiteEmail] = useState("");
  const [sitePhone, setSitePhone] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [siteDescription, setSiteDescription] = useState("");

  useEffect(() => {
    // Fetch site settings from the backend API
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/site-settings`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSiteName(data.sitename);
          setSiteLogo(data.sitelogo);
          setSiteEmail(data.email);
          setSitePhone(data.phone);
          setSiteAddress(data.address);
          setSiteDescription(data.description);
        }
      })
      .catch((error) => console.error("Error fetching site name:", error));
  }, []);

  return (
    <footer className="bg-dark text-light pt-5 pb-3 ">
      <Container>
        <Row>
          {/* Company Info */}
          <Col md={4} className="mb-4">
            {/* Display site logo and name from database */}
            <img 
              src={siteLogo || ""}
              height="40"
              width="40"
              style={{ borderRadius: '50%' }}
              className="me-2 mb-2"
              alt="Site Logo"
            />
            <h5 className="text-uppercase mb-3">{siteName || "Company Name"}</h5>
            <p className="text-white">
              {/* Display company description from database */}
              {siteDescription || "Your trusted partner for quality products and services. We deliver excellence in everything we do."}
            </p>
            <div className="mt-3">
              <a href="#" className="text-light me-3" aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="Twitter">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-light" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4">
            <h5 className="text-uppercase mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/product" className="text-white text-decoration-none">Products</Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-white text-decoration-none">Services</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={4} className="mb-4">
            <h5 className="text-uppercase mb-3">Contact Us</h5>
            <ul className="list-unstyled text-white">
              <li className="mb-2">
                <i className="bi bi-geo-alt-fill me-2"></i>
                {/* Display site address from database */}
                {siteAddress || "34 Main Owerri, Imo State, Nigeria"}
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i>
                {/* Display site phone from database */}
                {sitePhone || "+234 (704) 340-1308"}
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                {/* Display site email from database */}
                {siteEmail || "info@example.com"}
              </li>
              <li className="mb-2">
                <i className="bi bi-clock-fill me-2"></i>
                Mon - Fri: 9:00 AM - 6:00 PM
              </li>
            </ul>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-4">
          <Col className="text-center">
            <hr className="bg-secondary" />
            <p className="text-white mb-0">
              &copy; {new Date().getFullYear()} {siteName || "Company"}. All Rights Reserved.
              {' '}| {' '}
              <Link to="#" className="text-white text-decoration-none">Privacy Policy</Link>
              {' '}| {' '}
              <Link to="#" className="text-white text-decoration-none">Terms of Service</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
