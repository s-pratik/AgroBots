import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AiOutlineCloudSync, AiOutlineAreaChart, AiOutlineCloud } from "react-icons/ai";
import { GiWheat } from "react-icons/gi"; // Crop-related icon 🌾
import "./Features.css"; // Import external CSS for hover effects

const Features = () => {
  const location = useLocation();

  return (
    <div className="container my-5">
      <h2 className="text-center text-success fw-bold mb-4">Key Features</h2>
      <div className="row g-4">
        
        {/* Feature 1 - Real-Time Monitoring */}
        <div className="col-md-6 col-lg-3">
          <Link to="/feature1" className="text-decoration-none">
            <div className={`card feature-card border-0 shadow-lg p-3 h-100 text-center 
                ${location.pathname === "/feature1" ? "active-feature" : ""}`}>
              <div className="card-body">
                <AiOutlineCloudSync size={50} className={`feature-icon ${location.pathname === "/feature1" ? "text-white" : "text-success"}`} />
                <h5 className="fw-bold mt-3">Real-Time Monitoring</h5>
                <p className="card-text">Track soil moisture and temperature in real-time using IoT sensors.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Feature 2 - IoT-Based Analytics */}
        <div className="col-md-6 col-lg-3">
          <Link to="/feature2" className="text-decoration-none">
            <div className={`card feature-card border-0 shadow-lg p-3 h-100 text-center 
                ${location.pathname === "/feature2" ? "active-feature" : ""}`}>
              <div className="card-body">
                <AiOutlineAreaChart size={50} className={`feature-icon ${location.pathname === "/feature2" ? "text-white" : "text-success"}`} />
                <h5 className="fw-bold mt-3">IoT-Based Analytics</h5>
                <p className="card-text">Monitor environmental conditions efficiently with IoT-based data collection.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Feature 3 - Optimal Crop Recommendation */}
        <div className="col-md-6 col-lg-3">
          <Link to="/feature3" className="text-decoration-none">
            <div className={`card feature-card border-0 shadow-lg p-3 h-100 text-center 
                ${location.pathname === "/feature3" ? "active-feature" : ""}`}>
              <div className="card-body">
                <GiWheat size={50} className={`feature-icon ${location.pathname === "/feature3" ? "text-white" : "text-success"}`} />
                <h5 className="fw-bold mt-3">Optimal Crop Recommendation</h5>
                <p className="card-text">Get AI-powered suggestions for the best crop based on soil & climate data.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Feature 4 - Predictive Irrigation */}
        <div className="col-md-6 col-lg-3">
          <Link to="/feature4" className="text-decoration-none">
            <div className={`card feature-card border-0 shadow-lg p-3 h-100 text-center 
                ${location.pathname === "/feature4" ? "active-feature" : ""}`}>
              <div className="card-body">
                <AiOutlineCloud size={50} className={`feature-icon ${location.pathname === "/feature4" ? "text-white" : "text-success"}`} />
                <h5 className="fw-bold mt-3">Predictive Irrigation</h5>
                <p className="card-text">Optimize water usage with predictive insights for efficient irrigation.</p>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Features;
