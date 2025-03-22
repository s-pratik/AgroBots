import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css"; // Ensure this CSS file is imported

const Nabar = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-lg custom-shadow">
      <Container>
        {/* Brand Name */}
        <Navbar.Brand href="#home" className="text-success fw-bold fs-2">AgroBots</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Nav Links Fully Aligned to Right */}
          <Nav className="ms-auto">  
            <Nav.Link href="#home" className="text-success fw-bold">Home</Nav.Link>
            <Nav.Link href="#features" className="text-success fw-bold">Features</Nav.Link>
            <Nav.Link href="#pricing" className="text-success fw-bold">Pricing</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nabar;
