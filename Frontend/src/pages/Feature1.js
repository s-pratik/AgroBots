import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Feature1.css"; // Optional for styling

const firebaseConfig = {
  apiKey: "AIzaSyCxv3SQY...",
  authDomain: "soilmoisture-3abe7.firebaseapp.com",
  databaseURL: "https://soilmoisture-3abe7-default-rtdb.firebaseio.com",
  projectId: "soilmoisture-3abe7",
  storageBucket: "soilmoisture-3abe7.appspot.com",
  messagingSenderId: "413335580678",
  appId: "1:413335580678:web:41e4b495717d2ea8d31387",
  measurementId: "G-W47J2XV3WR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Feature1 = () => {
  const [sensorData, setSensorData] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Soil Moisture",
        data: [],
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Humidity",
        data: [],
        borderColor: "green",
        fill: false,
      },
      {
        label: "Rain Drop",
        data: [],
        borderColor: "red",
        fill: false,
      },
      {
        label: "Temperature",
        data: [],
        borderColor: "orange",
        fill: false,
      },
    ],
  });

  useEffect(() => {
    const sensorRef = ref(database, "SmartIrrigation");

    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestEntry = Object.values(data).pop();
        setSensorData(latestEntry);

        // Update chart data
        setChartData((prev) => ({
          labels: [...prev.labels, new Date().toLocaleTimeString()],
          datasets: [
            {
              ...prev.datasets[0],
              data: [...prev.datasets[0].data, latestEntry.SoilMoisture],
            },
            {
              ...prev.datasets[1],
              data: [...prev.datasets[1].data, latestEntry.Humidity],
            },
            {
              ...prev.datasets[2],
              data: [...prev.datasets[2].data, latestEntry.RainDrop],
            },
            {
              ...prev.datasets[3],
              data: [...prev.datasets[3].data, latestEntry.Temperature],
            },
          ],
        }));
      }
    });
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Real-Time Sensor Data</h2>
        {sensorData ? (
          <>
            <p><strong>Soil Moisture:</strong> {sensorData.SoilMoisture}mm</p>
            <p><strong>Humidity:</strong> {sensorData.Humidity}%</p>
            <p><strong>Rain Drop Level:</strong> {sensorData.RainDrop} mm</p>
            <p><strong>Temperature:</strong> {sensorData.Temperature}°C</p>
          </>
        ) : (
          <p>Loading data...</p>
        )}
      </div>

      <div className="chart">
        <h2>Sensor Data Trends</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Feature1;
