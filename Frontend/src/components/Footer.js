import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4">
            <h5 className="text-success fw-bold">About AgroBots</h5>
            <p>
              AgroBots is dedicated to helping farmers with **smart farming solutions**, using **real-time monitoring, predictive insights, and IoT-based automation**.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5 className="text-success fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-light text-decoration-none">Home</a></li>
              <li><a href="#features" className="text-light text-decoration-none">Features</a></li>
              <li><a href="#services" className="text-light text-decoration-none">Services</a></li>
              <li><a href="#contact" className="text-light text-decoration-none">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h5 className="text-success fw-bold">Contact Us</h5>
            <p><FaMapMarkerAlt className="text-success" /> Navi Mumbai, India</p>
            <p><FaPhone className="text-success" /> +91 98765 43210</p>
            <p><FaEnvelope className="text-success" /> support@agrobot.com</p>
            
            {/* Social Media Icons */}
            <div>
              <a href="#" className="text-light me-3"><FaFacebook size={24} /></a>
              <a href="#" className="text-light me-3"><FaTwitter size={24} /></a>
              <a href="#" className="text-light"><FaInstagram size={24} /></a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-4">
          <p className="mb-0">© 2025 Agrobot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
