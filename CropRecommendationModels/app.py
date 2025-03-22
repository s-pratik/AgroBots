import requests
import pandas as pd
import numpy as np
import time
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading

# Firebase URL (Ensure your Firebase Realtime Database is properly set up)
FIREBASE_URL = (
    "https://soilmoisture-3abe7-default-rtdb.firebaseio.com/SmartIrrigation.json"
)

# Flask API URL
CROP_API_URL = "http://127.0.0.1:5000/recommend_crop"

# Output CSV File
CSV_FILE = "sensor_data.csv"

# Maximum records to collect
MAX_RECORDS = 2000

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Crop recommendation logic
def recommend_crop_logic(N, P, K, pH):
    """
    Logic to recommend crops based on NPK and pH values.
    Replace this with your actual crop recommendation algorithm.
    """
    if pH < 6.0:
        return "Rice"
    elif 6.0 <= pH < 7.0:
        return "Wheat"
    else:
        return "Corn"


@app.route("/recommend_crop", methods=["POST"])
def recommend_crop():
    """
    Endpoint to recommend crops based on NPK and pH values.
    """
    try:
        # Get JSON data from the request
        data = request.json
        print(f"Received data: {data}")

        # Extract NPK and pH values
        N = data.get("N", 0)
        P = data.get("P", 0)
        K = data.get("K", 0)
        pH = data.get("pH", 0)

        # Validate input data
        if not all(isinstance(val, (int, float)) for val in [N, P, K, pH]):
            return (
                jsonify({"error": "Invalid input data: NPK and pH must be numbers"}),
                400,
            )

        # Get crop recommendation
        recommended_crop = recommend_crop_logic(N, P, K, pH)
        print(f"Recommended crop: {recommended_crop}")

        # Return the result
        return jsonify({"recommended_crop": recommended_crop})

    except Exception as e:
        print(f"Error in /recommend_crop: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


@app.route("/", methods=["GET"])
def home():
    """
    Home endpoint to check if the server is running.
    """
    return jsonify({"message": "FarmBuddy Crop Recommendation API is running!"})


def calculate_npk_ph(moisture, humidity, rain, temperature):
    """Estimate NPK and pH values based on sensor data."""
    leaching_risk = (moisture / 100) + (humidity / 100) + rain
    acidity_proxy = (temperature * humidity) / 1000

    if leaching_risk > 2:
        N = np.random.randint(30, 60)
        P = np.random.randint(20, 40)
        K = np.random.randint(20, 50)
    else:
        N = np.random.randint(70, 120)
        P = np.random.randint(40, 80)
        K = np.random.randint(50, 100)

    if acidity_proxy > 2:
        pH = np.round(np.random.uniform(5.5, 6.2), 1)
    elif acidity_proxy < 1.7:
        pH = np.round(np.random.uniform(6.8, 7.5), 1)
    else:
        pH = np.round(np.random.uniform(6.3, 6.7), 1)

    return N, P, K, pH


def fetch_data():
    """Fetch latest sensor data from Firebase"""
    try:
        response = requests.get(FIREBASE_URL)
        response.raise_for_status()
        data = response.json()

        if not data:
            print("❌ No data found in Firebase")
            return None

        latest_entry = list(data.values())[-1]
        return latest_entry

    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching data: {e}")
        return None


def get_crop_recommendation(N, P, K, pH):
    """Send NPK & pH data to Flask API and get crop recommendation"""
    try:
        payload = {"N": N, "P": P, "K": K, "pH": pH}
        response = requests.post(CROP_API_URL, json=payload)
        response.raise_for_status()
        return response.json().get("recommended_crop", "Unknown")
    except requests.exceptions.RequestException as e:
        print(f"❌ Crop Recommendation Error: {e}")
        return "Unknown"


def save_to_csv():
    """Continuously fetch data, compute NPK & pH, get crop recommendation, and save to CSV"""
    print("\n🚀 Starting Data Collection... (Press CTRL+C to stop)\n")

    # Create CSV file if it doesn't exist
    if not os.path.exists(CSV_FILE):
        pd.DataFrame(
            columns=[
                "SoilMoisture",
                "Humidity",
                "RainDrop",
                "Temperature",
                "N",
                "P",
                "K",
                "pH",
                "RecommendedCrop",
            ]
        ).to_csv(CSV_FILE, index=False)

    # Load existing data
    df = pd.read_csv(CSV_FILE)

    while len(df) < MAX_RECORDS:
        data = fetch_data()
        if data:
            # Extract sensor values
            soil_moisture = float(data.get("SoilMoisture", 0))
            humidity = float(data.get("Humidity", 0))
            rain_drop = float(data.get("RainDrop", 0))
            temperature = float(data.get("Temperature", 0))

            # Calculate NPK & pH
            N, P, K, pH = calculate_npk_ph(
                soil_moisture, humidity, rain_drop, temperature
            )

            # Get crop recommendation
            recommended_crop = get_crop_recommendation(N, P, K, pH)

            # Append new data
            new_data = pd.DataFrame(
                [
                    {
                        "SoilMoisture": soil_moisture,
                        "Humidity": humidity,
                        "RainDrop": rain_drop,
                        "Temperature": temperature,
                        "N": N,
                        "P": P,
                        "K": K,
                        "pH": pH,
                        "RecommendedCrop": recommended_crop,
                    }
                ]
            )

            df = pd.concat([df, new_data], ignore_index=True)
            df.to_csv(CSV_FILE, index=False)
            print(f"✅ Data Saved! Count: {len(df)} | Crop: {recommended_crop}")

        time.sleep(5)

    print("\n🎉 Data Collection Complete! 2000 Records Stored in sensor_data.csv 🎉")


if __name__ == "__main__":
    # Start the Flask app in a separate thread
    flask_thread = threading.Thread(
        target=lambda: app.run(debug=True, port=5000, use_reloader=False)
    )
    flask_thread.daemon = True
    flask_thread.start()

    # Start the data collection process
    save_to_csv()
