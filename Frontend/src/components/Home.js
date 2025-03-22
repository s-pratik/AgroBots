import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import agvid from "../videos/agvid.mp4"; // Adjust path as needed

const Home = () => {
  return (
    <div className="container-fluid p-0 position-relative">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="w-100"
        style={{ height: "70vh", objectFit: "cover" }}
      >
        <source src={agvid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Text - Full Width & Horizontally Centered */}
      <div className="position-absolute top-50 start-50 translate-middle w-100 text-center">
        <h1 className="fw-bold display-1 text-white animate__animated animate__fadeIn">
          Welcome to AgroBots
        </h1>
      </div>
    </div>
  );
};

export default Home;
