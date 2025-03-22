import pandas as pd
import numpy as np
import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS  # Enable CORS for frontend communication

# Load trained model and label encoder
try:
    model = joblib.load("crop_recommendation_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    print("✅ Model and Label Encoder Loaded Successfully!")
except Exception as e:
    print("❌ Error loading model or label encoder:", e)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Expected feature names
FEATURES = ["SoilMoisture", "Humidity", "RainDrop", "N", "P", "K", "pH"]


# Function to predict crop recommendation
def recommend_crop(data):
    try:
        print("🔄 Predicting Crop...")
        features = data[FEATURES]
        print("📊 Input Data for Prediction:\n", features)

        predicted_labels = model.predict(features)
        predicted_crops = label_encoder.inverse_transform(predicted_labels)

        print("🌱 Predicted Crop:", predicted_crops)
        return predicted_crops.tolist()
    except Exception as e:
        print("❌ Error in recommend_crop:", e)
        return ["Error in prediction"]


# Home route
@app.route("/")
def home():
    return jsonify(
        {
            "message": "Welcome to the Crop Recommendation API. Use /recommend_crop to get recommendations."
        }
    )


# Crop recommendation route
@app.route("/recommend_crop", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        print("📥 Received Data:", data)

        # Validate and fill missing fields with 0 (or a better default value)
        for feature in FEATURES:
            if feature not in data:
                print(f"⚠️ Missing {feature}, setting to default 0")
                data[feature] = 0

        df = pd.DataFrame([data])

        # Check if feature count matches model expectations
        if df.shape[1] != model.n_features_in_:
            return jsonify(
                {
                    "error": f"Incorrect number of features. Expected {model.n_features_in_}, got {df.shape[1]}"
                }
            )

        recommended_crop = recommend_crop(df)

        return jsonify({"RecommendedCrops": recommended_crop})

    except Exception as e:
        print("❌ Error in /recommend_crop:", e)
        return jsonify({"error": str(e)})


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5001)
