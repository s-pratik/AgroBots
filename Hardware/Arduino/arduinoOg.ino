// #include <SoftwareSerial.h>
// #include <DHT.h>

// // Pin Definitions
// #define SOIL_MOISTURE_PIN A0
// #define RAIN_SENSOR_PIN A1
// #define DHTPIN 2       // DHT22 Data pin
// #define DHTTYPE DHT22  

// // Initialize DHT sensor
// DHT dht(DHTPIN, DHTTYPE);

// // Software Serial for ESP8266
// SoftwareSerial espSerial(6, 5); // TX (D3) -> RX of ESP | RX (D2) -> TX of ESP

// void setup() {
//   Serial.begin(9600);  // Serial Monitor
//   espSerial.begin(9600); // Serial Communication with ESP8266
//   dht.begin();
//   Serial.println("Arduino Ready!");
// }

// void loop() {
//   // Read Soil Moisture
//   int soilMoisture = analogRead(SOIL_MOISTURE_PIN);
  
//   // Read Rain Sensor
//   int rainValue = analogRead(RAIN_SENSOR_PIN);
  
//   // Read DHT22
//   float temperature = dht.readTemperature();
//   float humidity = dht.readHumidity();

//   // Check if readings are valid
//   if (isnan(temperature) || isnan(humidity)) {
//     Serial.println("DHT22 error!");
//     return;
//   }

//   // Format data as JSON-like string
//   String sensorData = String(soilMoisture) + "," + String(rainValue) + "," + String(temperature) + "," + String(humidity);

//   // Print to Serial Monitor
//   Serial.println("Sending Data: " + sensorData);

//   // Send Data to ESP8266
//   espSerial.println(sensorData);

//   delay(2000); // Wait 2 seconds before next reading
// }


// #include <SoftwareSerial.h>
// #include <DHT.h>

// // Pin Definitions
// #define SOIL_MOISTURE_PIN A0
// #define RAIN_SENSOR_PIN A1
// #define DHTPIN 2        // DHT22 Data pin
// #define DHTTYPE DHT22   
// #define RELAY_PIN 7     // Relay module controlling the water pump

// // Initialize DHT sensor
// DHT dht(DHTPIN, DHTTYPE);

// // Software Serial for ESP8266
// SoftwareSerial espSerial(6, 5); // TX (D3) -> RX of ESP | RX (D2) -> TX of ESP

// // Threshold for soil moisture (Adjust based on your soil condition)
// #define SOIL_MOISTURE_THRESHOLD 650  

// void setup() {
//   Serial.begin(9600);  // Serial Monitor
//   espSerial.begin(9600); // Serial Communication with ESP8266
//   dht.begin();

//   pinMode(RELAY_PIN, OUTPUT);
//   digitalWrite(RELAY_PIN, LOW); // Ensure pump is OFF initially

//   Serial.println("Arduino Ready!");
// }

// void loop() {
//   // Read Soil Moisture
//   int soilMoisture = analogRead(SOIL_MOISTURE_PIN);
  
//   // Read Rain Sensor
//   int rainValue = analogRead(RAIN_SENSOR_PIN);
  
//   // Read DHT22
//   float temperature = dht.readTemperature();
//   float humidity = dht.readHumidity();

//   // Check if readings are valid
//   if (isnan(temperature) || isnan(humidity)) {
//     Serial.println("DHT22 error!");
//     return;
//   }

//   // Control Water Pump based on Soil Moisture
//   if (soilMoisture < SOIL_MOISTURE_THRESHOLD) {
//     digitalWrite(RELAY_PIN, HIGH);  // Turn ON pump
//     Serial.println("Pump ON - Soil is dry!");
//   } else {
//     digitalWrite(RELAY_PIN, LOW);   // Turn OFF pump
//     Serial.println("Pump OFF - Soil is wet enough!");
//   }

//   // Format data as JSON-like string
//   String sensorData = String(soilMoisture) + "," + String(rainValue) + "," + String(temperature) + "," + String(humidity);

//   // Print to Serial Monitor
//   Serial.println("Sending Data: " + sensorData);

//   // Send Data to ESP8266
//   espSerial.println(sensorData);

//   delay(60000); // Wait 2 seconds before next reading
// }

#include <SoftwareSerial.h>
#include <DHT.h>

// Pin Definitions
#define SOIL_MOISTURE_PIN A0
#define RAIN_SENSOR_PIN A1
#define DHTPIN 2
#define DHTTYPE DHT22
#define PUMP_PIN 7  // Pin to control the relay

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// Software Serial for ESP8266
SoftwareSerial espSerial(6, 5); // TX -> RX of ESP | RX -> TX of ESP

void setup() {
  Serial.begin(9600);
  espSerial.begin(9600);
  dht.begin();
  
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW); // Ensure pump is OFF initially
  
  Serial.println("Arduino Ready!");
}

void loop() {
  // Read Soil Moisture
  int soilMoisture = analogRead(SOIL_MOISTURE_PIN);
  
  // Read Rain Sensor
  int rainValue = analogRead(RAIN_SENSOR_PIN);
  
  // Read DHT22
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Check if readings are valid
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT22 error!");
    return;
  }

  // Automatic pump control
  // if (soilMoisture > 500) {
  //   digitalWrite(PUMP_PIN, HIGH); // Turn ON pump
  // } else {
  //   digitalWrite(PUMP_PIN, LOW);  // Turn OFF pump
  // }

  // Format data as a string and send it to ESP8266
  String sensorData = String(soilMoisture) + "," + String(rainValue) + "," + 
                      String(temperature) + "," + String(humidity);

  Serial.println("Sending Data: " + sensorData);
  espSerial.println(sensorData);

  // Check for manual control from ESP8266
    if (espSerial.available()) {
    Serial.println("Data detected from ESP8266!");
    
    String command = espSerial.readStringUntil('\n');
    command.trim();
    Serial.println("Received Command: " + command);

    if (command == "PUMP_ON") {
        digitalWrite(PUMP_PIN, HIGH);
        Serial.println("Pump Turned ON");
    } else if (command == "PUMP_OFF") {
        digitalWrite(PUMP_PIN, LOW);
        Serial.println("Pump Turned OFF");
    } else {
        Serial.println("Unknown command received: " + command);
    }
} else {
    Serial.println("No data received from ESP8266.");
}

  delay(2000);
}
