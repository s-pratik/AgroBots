import React, { useState } from "react";

const Feature2 = () => {
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const recommendCrop = async () => {
        const sensorData = {
            SoilMoisture: 300,
            Humidity: 50,
            RainDrop: 1,
            N: 40,
            P: 30,
            K: 50,
            pH: 6.5
        };

        console.log("📤 Sending Data to API:", JSON.stringify(sensorData));
        setIsLoading(true);
        setError(null);
        setRecommendation(null);

        try {
            const response = await fetch("http://127.0.0.1:5001/recommend_crop", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sensorData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Unknown error occurred");
            }

            const data = await response.json();
            console.log("✅ API Response:", data);
            
            // Handle different response formats
            const recommendedCrop = data.RecommendedCrops || 
                                 data.recommended_crop || 
                                 data.crop || 
                                 "No recommendation available";
            
            // Ensure we have a string (in case response is an array)
            const cropString = Array.isArray(recommendedCrop) 
                ? recommendedCrop[0] 
                : recommendedCrop;
            
            setRecommendation(cropString);
        } catch (err) {
            console.error("❌ Error fetching crop recommendation:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Safe function to get image search term
    const getImageSearchTerm = (crop) => {
        if (!crop) return "agriculture";
        if (typeof crop === 'string') return crop.toLowerCase();
        return "agriculture";
    };

    return (
        <div className="min-vh-100 d-flex align-items-center" style={{
            background: "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-success text-white py-3">
                                <h2 className="mb-0 text-center">
                                    <i className="fas fa-seedling me-2"></i>
                                    Smart Crop Recommendation
                                </h2>
                            </div>
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <img 
                                        src="https://cdn-icons-png.flaticon.com/512/3079/3079165.png" 
                                        alt="Crop Recommendation" 
                                        style={{ width: '100px', height: '100px' }}
                                        className="mb-3"
                                    />
                                    <p className="lead">
                                        Get AI-powered crop recommendations based on your soil and weather conditions
                                    </p>
                                </div>

                                <div className="d-grid">
                                    <button 
                                        className={`btn btn-lg ${recommendation ? 'btn-outline-success' : 'btn-success'} py-3`}
                                        onClick={recommendCrop}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-magic me-2"></i>
                                                Get Recommendation
                                            </>
                                        )}
                                    </button>
                                </div>

                                {recommendation && (
                                    <div className="alert alert-success mt-4 text-center">
                                        <h4 className="mb-0">
                                            <i className="fas fa-check-circle me-2"></i>
                                            Best Crop: <span className="text-success fw-bold">{recommendation}</span>
                                        </h4>
                                        <div className="mt-2">
                                            <img 
                                                src={`https://source.unsplash.com/300x200/?${getImageSearchTerm(recommendation)},agriculture`} 
                                                alt={recommendation}
                                                className="img-fluid rounded mt-2"
                                                style={{ maxHeight: '200px' }}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="alert alert-danger mt-4 text-center">
                                        <h4 className="mb-0">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {error}
                                        </h4>
                                    </div>
                                )}

                                <div className="mt-4 text-center text-muted small">
                                    <i className="fas fa-info-circle me-1"></i>
                                    Recommendation based on current soil and weather conditions
                                </div>
                            </div>
                            <div className="card-footer bg-light text-center py-2">
                                <small className="text-muted">
                                    <i className="fas fa-clock me-1"></i>
                                    Last updated: {new Date().toLocaleString()}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feature2;