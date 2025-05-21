import pandas as pd
import numpy as np
import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from datetime import datetime
import os


# -------------------- Model Training --------------------
def train_model():
    """Train the RandomForestClassifier model and save it to disk."""
    try:
        dataset_path = r"C:\Users\ANKIT\Desktop\FarmBuddy\sensor_data.csv"

        # Load dataset
        df = pd.read_csv(dataset_path)

        # Rename columns
        df.rename(
            columns={
                "Soil Moisture (%)": "SoilMoisture",
                "Soil Humidity (%)": "Humidity",
                "Rain Drop Level (mm)": "RainDrop",
                "Temperature (Â°C)": "Temperature",
                "Recommended Crop": "Crop",
            },
            inplace=True,
        )

        # Add simulated data if missing
        if "N" not in df.columns:
            df["N"] = np.random.randint(30, 120, size=len(df))
        if "P" not in df.columns:
            df["P"] = np.random.randint(20, 80, size=len(df))
        if "K" not in df.columns:
            df["K"] = np.random.randint(20, 100, size=len(df))
        if "pH" not in df.columns:
            df["pH"] = np.round(np.random.uniform(5.5, 7.5, size=len(df)), 1)

        # Define features and target
        X = df[["SoilMoisture", "Humidity", "RainDrop", "N", "P", "K", "pH"]]
        y = df["Crop"]

        # Encode labels
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y)

        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y_encoded)

        # Save model and encoder
        joblib.dump(model, "crop_recommendation_model.pkl")
        joblib.dump(label_encoder, "label_encoder.pkl")

        print("✅ Model trained and saved successfully!")
    except Exception as e:
        print(f"❌ Error during model training: {str(e)}")


# -------------------- Flask API --------------------
app = Flask(__name__)
CORS(app)  # Allow CORS for frontend interaction

# Load model and label encoder
try:
    model = joblib.load("crop_recommendation_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    print("✅ Model and label encoder loaded.")
except Exception as e:
    print(f"❌ Failed to load model or encoder: {str(e)}")
    train_model()
    model = joblib.load("crop_recommendation_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")


# Normalize function
def normalize_sensor_data(data):
    data["Humidity"] = np.clip((data["Humidity"] / 100) * 100, 1, 100)
    data["RainDrop"] = np.clip((data["RainDrop"] / 50) * 300, 1, 300)
    return data


# Crop recommendation logic
def recommend_crop(data):
    features = data[["SoilMoisture", "Humidity", "RainDrop", "N", "P", "K", "pH"]]
    predictions = model.predict(features)
    return label_encoder.inverse_transform(predictions).tolist()


# Routes
@app.route("/")
def home():
    return jsonify({"message": "Welcome to Crop Recommendation API!"})


@app.route("/recommend_crop", methods=["POST", "OPTIONS"])
def recommend():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight passed."}), 200

    try:
        data = request.get_json()
        df = pd.DataFrame([data])

        df = normalize_sensor_data(df)

        print(f"[{datetime.now()}] Received data: {df.to_dict(orient='records')}")

        df = df[["SoilMoisture", "Humidity", "RainDrop", "N", "P", "K", "pH"]]

        result = recommend_crop(df)
        return jsonify({"RecommendedCrops": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------------------- Main --------------------
if __name__ == "__main__":
    if not os.path.exists("crop_recommendation_model.pkl"):
        train_model()
    app.run(debug=True, port=5001)
