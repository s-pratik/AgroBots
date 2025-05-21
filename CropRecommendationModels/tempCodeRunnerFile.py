import pandas as pd
import numpy as np
import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder


# -------------------- Model Training --------------------
def train_model():
    """Train the RandomForestClassifier model and save it to disk."""
    try:
        # Load dataset
        df = pd.read_csv("crop_dataset.csv")

        # Rename columns (if necessary)
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

        # Add columns for N, P, K, and pH (if not already present)
        df["N"] = np.random.randint(30, 120, size=len(df))  # Example data
        df["P"] = np.random.randint(20, 80, size=len(df))  # Example data
        df["K"] = np.random.randint(20, 100, size=len(df))  # Example data
        df["pH"] = np.round(
            np.random.uniform(5.5, 7.5, size=len(df)), 1
        )  # Example data

        # Define features and target
        X = df[
            ["SoilMoisture", "Humidity", "RainDrop", "N", "P", "K", "pH"]
        ]  # Use all 7 features
        y = df["Crop"]

        # Encode target variable
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y)

        # Train the model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y_encoded)

        # Save the model and label encoder
        joblib.dump(model, "crop_recommendation_model.pkl")
        joblib.dump(label_encoder, "label_encoder.pkl")

        print("✅ Model retrained with 7 features and saved!")
    except Exception as e:
        print(f"❌ Error training model: {str(e)}")


# -------------------- Flask API --------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model and label encoder
try:
    model = joblib.load("crop_recommendation_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    print("✅ Model and label encoder loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model or label encoder: {str(e)}")
    exit()


# Function to normalize sensor data to match dataset ranges
def normalize_sensor_data(data):
    """Normalize sensor values to match dataset ranges"""

    data["Humidity"] = np.clip(
        (data["Humidity"] / 100) * 100, 1, 100
    )  # Scale 0-100 to 1-100
    data["RainDrop"] = np.clip(
        (data["RainDrop"] / 50) * 300, 1, 300
    )  # Scale 0-50 to 1-300

    return data


# Function to predict crop recommendation
def recommend_crop(data):
    features = data[["SoilMoisture", "Humidity", "RainDrop", "N", "P", "K", "pH"]]
    predicted_labels = model.predict(features)
    predicted_crops = label_encoder.inverse_transform(predicted_labels)
    return predicted_crops.tolist()  # Convert NumPy array to list for JSON response


@app.route("/")
def home():
    return jsonify(
        {
            "message": "Welcome to the Crop Recommendation API. Use /recommend_crop to get recommendations."
        }
    )


@app.route("/recommend_crop", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        df = pd.DataFrame([data])

        # Normalize sensor values
        df = normalize_sensor_data(df)

        # Debug: Print input data
        print("Input Data:", df.to_dict(orient="records"))

        # Ensure correct feature set
        df = df[["SoilMoisture", "Humidity", "RainDrop", "N", "P", "K", "pH"]]

        recommended_crop = recommend_crop(df)

        return jsonify({"RecommendedCrops": recommended_crop})

    except Exception as e:
        return jsonify({"error": str(e)})


# -------------------- Main --------------------
if __name__ == "__main__":
    # Train the model (if needed)
    train_model()

    # Start the Flask API
    app.run(debug=True, port=5001)
