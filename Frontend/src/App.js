import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nabar from "./components/Nabar";
import Home from "./components/Home";
import Features from "./components/Features"; // Keep it separate
import About from "./components/About";
import Footer from "./components/Footer";
import Feature1 from "./pages/Feature1";
import Feature2 from "./pages/Feature2";
import Feature3 from "./pages/Feature3";
import Feature4 from "./pages/Feature4";

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Nabar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<> <Home /> <Features /> </>} /> 
            <Route path="/features" element={<Features />} />
            <Route path="/feature1" element={<Feature1 />} />
            <Route path="/feature2" element={<Feature2 />} />
            <Route path="/feature3" element={<Feature3 />} />
            <Route path="/feature4" element={<Feature4 />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer className="mt-auto" />
      </div>
    </Router>
  );
};

export default App;
