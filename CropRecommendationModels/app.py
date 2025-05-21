import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
import numpy as np
import joblib
import time
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# -------------------- Initialize Firebase --------------------
firebase_cred_path = "C:/Users/ANKIT/Desktop/FarmBuddy/majorproject1-5d560-firebase-adminsdk-fbsvc-0d04c4a6cf.json"

try:
    # Load Firebase credentials
    cred = credentials.Certificate(firebase_cred_path)
    # Initialize Firebase app
    firebase_admin.initialize_app(
        cred, {"databaseURL": "https://soilmoisture-3abe7-default-rtdb.firebaseio.com"}
    )
    print("✅ Firebase initialized successfully!")
except Exception as e:
    print(f"❌ Error initializing Firebase: {str(e)}")
    exit()

# -------------------- Load Dataset & Train Model --------------------
try:
    df = pd.read_csv("crop_dataset.csv")

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
    # These can be calculated or fetched from another source
    df["N"] = np.random.randint(30, 120, size=len(df))  # Example data
    df["P"] = np.random.randint(20, 80, size=len(df))  # Example data
    df["K"] = np.random.randint(20, 100, size=len(df))  # Example data
    df["pH"] = np.round(np.random.uniform(5.5, 7.5, size=len(df)), 1)  # Example data

    # Use all 7 features for training
    X = df[["SoilMoisture", "Humidity", "RainDrop", "Temperature", "N", "P", "K", "pH"]]
    y = df["Crop"]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y_encoded)
    print("✅ Model trained successfully with 7 features!")
except Exception as e:
    print(f"❌ Error loading dataset or training model: {str(e)}")
    exit()


# -------------------- Function to Calculate NPK & pH --------------------
def calculate_npk_ph(moisture, humidity, rain, temperature):
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

    return {"N": N, "P": P, "K": K, "pH": pH}


# -------------------- Fetch Latest Data from Firebase --------------------
def get_latest_data():
    try:
        ref = db.reference("SmartIrrigation")
        data = ref.get()

        if data:
            return list(data.values())[-1]  # Fetch last entry
        else:
            print("⚠️ No data found in Firebase.")
            return None
    except Exception as e:
        print(f"❌ Error fetching data from Firebase: {str(e)}")
        return None


# -------------------- Continuous Data Collection --------------------
csv_filename = "sensor_predictions.csv"
data_count = 0

# Initialize CSV file with headers
columns = [
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
pd.DataFrame(columns=columns).to_csv(csv_filename, index=False)

print("\n🚀 Starting Data Collection... (Press CTRL+C to stop)")

while data_count < 1000:
    try:
        latest_data = get_latest_data()

        if latest_data:
            # Extract sensor values
            soil_moisture = float(latest_data.get("SoilMoisture", 0))
            humidity = float(latest_data.get("Humidity", 0))
            rain = float(latest_data.get("RainDrop", 0))
            temperature = float(latest_data.get("Temperature", 0))

            # Calculate NPK & pH values
            npk_ph = calculate_npk_ph(soil_moisture, humidity, rain, temperature)

            # Prepare input for model (all 7 features)
            input_features = [
                [
                    soil_moisture,
                    humidity,
                    rain,
                    temperature,
                    npk_ph["N"],
                    npk_ph["P"],
                    npk_ph["K"],
                    npk_ph["pH"],
                ]
            ]

            # Predict crop
            predicted_label = model.predict(input_features)[0]
            predicted_crop = label_encoder.inverse_transform([predicted_label])[0]

            # Store results
            result = {
                "SoilMoisture": soil_moisture,
                "Humidity": humidity,
                "RainDrop": rain,
                "Temperature": temperature,
                "N": npk_ph["N"],
                "P": npk_ph["P"],
                "K": npk_ph["K"],
                "pH": npk_ph["pH"],
                "RecommendedCrop": predicted_crop,
            }

            # Append to CSV
            pd.DataFrame([result]).to_csv(
                csv_filename, mode="a", header=False, index=False
            )
            data_count += 1

            # Print live update
            print(f"✅ {data_count}/1000 Data Captured: {result}")

        else:
            print("⚠️ No new data found in Firebase. Retrying...")

        time.sleep(5)  # Fetch new data every 5 seconds

    except KeyboardInterrupt:
        print("\n⏹️ Data collection stopped by user.")
        break

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        time.sleep(5)  # Retry after 5 seconds

print("\n🎉 Data Collection Complete! Results saved in 'sensor_predictions.csv'")
