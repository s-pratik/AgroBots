// #include <ESP8266WiFi.h>
// #include <FirebaseESP8266.h>
// #include <SoftwareSerial.h>

// // WiFi Credentials
// #define WIFI_SSID "Redme"
// #define WIFI_PASSWORD "30303030"

// // Firebase Credentials
// #define FIREBASE_HOST "soilmoisture-3abe7-default-rtdb.firebaseio.com"
// #define FIREBASE_AUTH "V8HSNOkBU03Y5jlgjmVIl8MOSZUNNssydm6xIrFr"

// // Firebase objects
// FirebaseData firebaseData;
// FirebaseAuth auth;
// FirebaseConfig config;

// // SoftwareSerial for communication with Arduino
// #define RX_PIN D7  // ESP8266 RX (Connect to Arduino TX)
// #define TX_PIN D8  // ESP8266 TX (Connect to Arduino RX)
// SoftwareSerial mySerial(RX_PIN, TX_PIN);

// void setup() {
//   Serial.begin(9600);  // Serial Monitor
//   mySerial.begin(9600); // Communication with Arduino

//   WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
//   Serial.print("Connecting to WiFi");
  
//   while (WiFi.status() != WL_CONNECTED) {
//     delay(1000);
//     Serial.print(".");
//   }
//   Serial.println("\nWiFi Connected!");

//   config.host = FIREBASE_HOST;
//   config.signer.tokens.legacy_token = FIREBASE_AUTH;
//   Firebase.begin(&config, &auth);
//   Firebase.reconnectWiFi(true);
// }

// void loop() {
//   if (mySerial.available()) {  // Read from Arduino
//     String data = mySerial.readStringUntil('\n');
//     data.trim();  // Remove any extra spaces or newline characters

//     Serial.println("Received from Arduino: " + data);  // Debugging

//     // Parse the received data properly
//     int soilMoisture, rainDrop;
//     float temperature, humidity;

//     int scanCount = sscanf(data.c_str(), "%d,%d,%f,%f", &soilMoisture, &rainDrop, &temperature, &humidity);

//     if (scanCount != 4) {
//       Serial.println("Error: Data format incorrect");
//       return;
//     }

//     Serial.println("Parsed Data:");
//     Serial.println("Soil Moisture: " + String(soilMoisture));
//     Serial.println("Rain Drop: " + String(rainDrop));
//     Serial.println("Temperature: " + String(temperature));
//     Serial.println("Humidity: " + String(humidity));

//     // Sending data to Firebase
//     String path = "/SmartIrrigation/" + String(millis());

//     if (Firebase.setFloat(firebaseData, path + "/Temperature", temperature)) {
//       Serial.println("Temperature Sent to Firebase");
//     } else {
//       Serial.println("Firebase Error: " + firebaseData.errorReason());
//     }

//     if (Firebase.setFloat(firebaseData, path + "/Humidity", humidity)) {
//       Serial.println("Humidity Sent to Firebase");
//     } else {
//       Serial.println("Firebase Error: " + firebaseData.errorReason());
//     }

//     if (Firebase.setInt(firebaseData, path + "/SoilMoisture", soilMoisture)) {
//       Serial.println("Soil Moisture Sent to Firebase");
//     } else {
//       Serial.println("Firebase Error: " + firebaseData.errorReason());
//     }

//     if (Firebase.setInt(firebaseData, path + "/RainDrop", rainDrop)) {
//       Serial.println("Rain Drop Sent to Firebase");
//     } else {
//       Serial.println("Firebase Error: " + firebaseData.errorReason());
//     }

//     Serial.println("Data Sent Successfully!\n");
//   }

//   delay(2000);
// }

// #include <SoftwareSerial.h>
// #include <ESP8266WiFi.h>
// #include <FirebaseESP8266.h>

// #define WIFI_SSID "Redme"
// #define WIFI_PASSWORD "30303030"

// #define FIREBASE_HOST "soilmoisture-3abe7-default-rtdb.firebaseio.com"
// #define FIREBASE_AUTH "V8HSNOkBU03Y5jlgjmVIl8MOSZUNNssydm6xIrFr"

// // Define software serial for ESP8266 (D6 = RX, D5 = TX)
// SoftwareSerial espSerial(D7, D8);

// FirebaseData firebaseData;
// FirebaseAuth auth;
// FirebaseConfig config;

// bool manualControl = false;
// bool pumpState = false;  // False = OFF, True = ON
// unsigned long lastCheckTime = 0;
// unsigned long scheduleTime = 0; // Time in milliseconds for scheduling pump ON

// void setup() {
//     Serial.begin(115200);
//     espSerial.begin(9600);

//     WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
//     while (WiFi.status() != WL_CONNECTED) {
//         delay(1000);
//         Serial.print(".");
//     }
//     Serial.println("\nConnected to WiFi");

//     config.host = FIREBASE_HOST;
//     config.signer.tokens.legacy_token = FIREBASE_AUTH;
//     Firebase.begin(&config, &auth);
//     Firebase.reconnectWiFi(true);

//     Serial.println("ESP8266 Ready!");
// }

// void loop() {
//     if (espSerial.available()) {
//         String data = espSerial.readStringUntil('\n');  // Read from Arduino
//         Serial.println("Received from Arduino: " + data);
//         //String data = mySerial.readStringUntil('\n');
//     data.trim();  // Remove any extra spaces or newline characters

//    // Serial.println("Received from Arduino: " + data);  // Debugging

//     // Parse the received data properly
//     int soilMoisture, rainDrop;
//     float temperature, humidity;

//     int scanCount = sscanf(data.c_str(), "%d,%d,%f,%f", &soilMoisture, &rainDrop, &temperature, &humidity);

//     if (scanCount != 4) {
//       Serial.println("Error: Data format incorrect");
//       return;
//     }

//     Serial.println("Parsed Data:");
//     Serial.println("Soil Moisture: " + String(soilMoisture));
//     Serial.println("Rain Drop: " + String(rainDrop));
//     Serial.println("Temperature: " + String(temperature));
//     Serial.println("Humidity: " + String(humidity));

//     // Sending data to Firebase
//     String path = "/SmartIrrigation/" + String(millis());

//     if (Firebase.setFloat(firebaseData, path + "/Temperature", temperature)) {
//       Serial.println("Temperature Sent to Firebase");
//     } else {
//       Serial.println("Firebase Error: " + firebaseData.errorReason());
//     }

//     if (Firebase.setFloat(firebaseData, path + "/Humidity", humidity)) {
//       Serial.println("Humidity Sent to Firebase");
//     } else {
//       Serial.println("Firebase Error: " + firebaseData.errorReason());
//     }

//     if (Firebase.setInt(firebaseData, path + "/SoilMoisture", soilMoisture)) {
//       Serial.println("Soil Moisture Sent to Firebase");
//     } else {
//       Serial.println("Firebase Error: " + firebaseData.errorReason());
//     }

//     if (Firebase.setInt(firebaseData, path + "/RainDrop", rainDrop)) {
//       Serial.println("Rain Drop Sent to Firebase");
//     } else {
//       Serial.println("Firebase Error: " + firebaseData.errorReason());
//     }

   
        
//         // int smIndex = data.indexOf(",");
//         // int rainIndex = data.indexOf(",", smIndex + 1);
//         // int tempIndex = data.indexOf(",", rainIndex + 1);

//         // int soilMoisture = data.substring(0, smIndex).toInt();
//         // int rainDrop = data.substring(smIndex + 1, rainIndex).toInt();
//         // float temperature = data.substring(rainIndex + 1, tempIndex).toFloat();
//         // float humidity = data.substring(tempIndex + 1).toFloat();

//         // String path = "/SmartIrrigation/" + String(millis());

//         // // Upload to Firebase
//         // Firebase.setInt(firebaseData,path + "/SmartIrrigation/SoilMoisture", soilMoisture);
//         // Firebase.setInt(firebaseData,path + "/SmartIrrigation/RainDrop", rainDrop);
//         // Firebase.setFloat(firebaseData,path + "/SmartIrrigation/Temperature", temperature);
//         // Firebase.setFloat(firebaseData,path +"/SmartIrrigation/Humidity", humidity);

//         Serial.println("Data Uploaded to Firebase!");
//     }

//     // Check Firebase for manual pump control
//     if (Firebase.getBool(firebaseData, "/SmartIrrigation/PumpManual")) {
//         manualControl = firebaseData.boolData();
//     }

//     if (Firebase.getBool(firebaseData, "/SmartIrrigation/PumpState")) {
//         pumpState = firebaseData.boolData();
//     }

//     if (manualControl) {
//         // Send pump ON/OFF command to Arduino
//         espSerial.println(pumpState ? "PUMP_ON" : "PUMP_OFF");
//         Serial.println(pumpState ? "Pump Turned ON (Manual)" : "Pump Turned OFF (Manual)");
//     } else {
//         // Automatic Mode (Soil Moisture Based)
//         if (Firebase.getInt(firebaseData, "/SmartIrrigation/ScheduledTime")) {
//             scheduleTime = firebaseData.intData();
//         }

//         unsigned long currentMillis = millis();
//         if (scheduleTime > 0 && currentMillis > scheduleTime) {
//             pumpState = true;
//             Firebase.setBool(firebaseData, "/SmartIrrigation/PumpState", true);
//             espSerial.println("PUMP_ON");
//             Serial.println("Pump Turned ON (Scheduled)");
//         } 
//         else if (pumpState) {
//             espSerial.println("PUMP_OFF");
//             Serial.println("Pump Turned OFF");
//         }
//     }

//     delay(5000);
// }

#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>

#define WIFI_SSID "Redme"
#define WIFI_PASSWORD "30303030"

#define FIREBASE_HOST "soilmoisture-3abe7-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "V8HSNOkBU03Y5jlgjmVIl8MOSZUNNssydm6xIrFr"

// Define software serial for ESP8266 (D7 = RX, D8 = TX)
SoftwareSerial espSerial(D7, D8);

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

bool manualControl = false;
bool pumpState = false;  // False = OFF, True = ON
unsigned long lastCheckTime = 0;
unsigned long scheduleTime = 0;
bool scheduleActive = false;

void setup() {
    Serial.begin(9600);
    espSerial.begin(9600);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi");

    config.host = FIREBASE_HOST;
    config.signer.tokens.legacy_token = FIREBASE_AUTH;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    Serial.println("ESP8266 Ready!");
}

void loop() {
  int soilMoisture, rainDrop;
        float temperature, humidity;
    if (espSerial.available()) {
        String data = espSerial.readStringUntil('\n');  // Read from Arduino
        data.trim();

        
        int scanCount = sscanf(data.c_str(), "%d,%d,%f,%f", &soilMoisture, &rainDrop, &temperature, &humidity);

        if (scanCount != 4) {
            Serial.println("Error: Data format incorrect");
            return;
        }

        Serial.println("Soil Moisture: " + String(soilMoisture));
        Serial.println("Rain Drop: " + String(rainDrop));
        Serial.println("Temperature: " + String(temperature));
        Serial.println("Humidity: " + String(humidity));

        // Send data to Firebase
        String path = "/SmartIrrigation/" + String(millis());
        // Firebase.setFloat(firebaseData, path + "/Temperature", temperature);
        // Firebase.setFloat(firebaseData, path + "/Humidity", humidity);
        // Firebase.setInt(firebaseData, path + "/SoilMoisture", soilMoisture);
        // Firebase.setInt(firebaseData, path + "/RainDrop", rainDrop);
        if (Firebase.setFloat(firebaseData, path + "/Temperature", temperature)) {
      Serial.println("Temperature Sent to Firebase");
    } else {
      Serial.println("Firebase Error: " + firebaseData.errorReason());
    }

    if (Firebase.setFloat(firebaseData, path + "/Humidity", humidity)) {
      Serial.println("Humidity Sent to Firebase");
    } else {
      Serial.println("Firebase Error: " + firebaseData.errorReason());
    }

    if (Firebase.setInt(firebaseData, path + "/SoilMoisture", soilMoisture)) {
      Serial.println("Soil Moisture Sent to Firebase");
    } else {
      Serial.println("Firebase Error: " + firebaseData.errorReason());
    }

    if (Firebase.setInt(firebaseData, path + "/RainDrop", rainDrop)) {
      Serial.println("Rain Drop Sent to Firebase");
    } else {
      Serial.println("Firebase Error: " + firebaseData.errorReason());
    }
    }

    // Check Firebase for manual pump control
    if (Firebase.getBool(firebaseData, "/SmartIrrigation/PumpManual")) {
    manualControl = firebaseData.boolData();
    Serial.println("Pump Manual Control: " + String(manualControl));
} else {
    Serial.println("Failed to read PumpManual from Firebase: " + firebaseData.errorReason());
}

if (Firebase.getBool(firebaseData, "/SmartIrrigation/pumpState")) {
    pumpState = firebaseData.boolData();
    Serial.println("Pump State: " + String(pumpState));
} else {
    Serial.println("Failed to read PumpState from Firebase: " + firebaseData.errorReason());
}


    if (manualControl) {
    Serial.println("Manual Control Enabled");
    
    if (pumpState) {
        espSerial.println("PUMP_ON");
        Serial.println("Pump Turned ON (Manual)");
    } else {
        espSerial.println("PUMP_OFF");
        Serial.println("Pump Turned OFF (Manual)");
    }
     // Debug: Confirm data is being sent to Arduino
    Serial.println("Sending command to Arduino: " + String(pumpState ? "PUMP_ON" : "PUMP_OFF"));
    //delay(1000); // Small delay to ensure Arduino processes the command
}

    else {
        // Automatic Control (Soil Moisture Based)
        if (Firebase.getInt(firebaseData, "/SmartIrrigation/ScheduledTime")) {
            scheduleTime = firebaseData.intData();
        }

        unsigned long currentMillis = millis();
      if (!manualControl) { // Only run automatic control when manual mode is OFF
    if (scheduleTime > 0 && currentMillis >= scheduleTime && !scheduleActive) {
        scheduleActive = true;
        pumpState = true;
        Firebase.setBool(firebaseData, "/SmartIrrigation/pumpState", true);
        espSerial.println("PUMP_ON");
        Serial.println("Pump Turned ON (Scheduled)");
        delay(1000);
        pumpState = false;
        Firebase.setBool(firebaseData, "/SmartIrrigation/pumpState", false);
        espSerial.println("PUMP_OFF");
        Serial.println("Pump Turned OFF (After Scheduled Run)");
        scheduleTime = 0;
        Firebase.setInt(firebaseData, "/SmartIrrigation/ScheduledTime", 0);
        scheduleActive = false;
    } 
    else if (!scheduleActive && soilMoisture > 500) {
        pumpState = true;
        Firebase.setBool(firebaseData, "/SmartIrrigation/pumpState", true);
        espSerial.println("PUMP_ON");
        Serial.println("Pump Turned ON (Auto - Soil Dry)");
    } 
    else if (!scheduleActive && soilMoisture < 500) {
        pumpState = false;
        Firebase.setBool(firebaseData, "/SmartIrrigation/pumpState", false);
        espSerial.println("PUMP_OFF");
        Serial.println("Pump Turned OFF (Auto - Soil Wet)");
    }
}
    }

    delay(2000);  // Reduce Firebase read frequency
}
