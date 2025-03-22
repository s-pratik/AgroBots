import React, { useState } from "react";

const Feature2 = () => {
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);

    const recommendCrop = async () => {
        const sensorData = {
            SoilMoisture: 300,  // Example values (replace with real ones)
            Humidity: 50,
            RainDrop: 1,
            N: 40,
            P: 30,
            K: 50,
            pH: 6.5
        };

        console.log("📤 Sending Data to API:", JSON.stringify(sensorData));

        try {
            const response = await fetch("http://127.0.0.1:5000/recommend_crop", {
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
            setRecommendation(data.RecommendedCrops);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching crop recommendation:", err);
            setError(err.message);
            setRecommendation(null);
        }
    };

    return (
        <div className="container mt-5">
            <h2>🌾 Crop Recommendation</h2>
            <button className="btn btn-primary" onClick={recommendCrop}>
                Get Recommendation
            </button>
            
            {recommendation && (
                <div className="alert alert-success mt-3">
                    Recommended Crop: <strong>{recommendation}</strong>
                </div>
            )}
            
            {error && (
                <div className="alert alert-danger mt-3">
                    ❌ Error: {error}
                </div>
            )}
        </div>
    );
};

export default Feature2;
