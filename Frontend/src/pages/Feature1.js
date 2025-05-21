import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";

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
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3
      },
      {
        label: "Humidity",
        data: [],
        borderColor: "#1cc88a",
        backgroundColor: "rgba(28, 200, 138, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3
      },
      {
        label: "Rain Drop",
        data: [],
        borderColor: "#e74a3b",
        backgroundColor: "rgba(231, 74, 59, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3
      },
      {
        label: "Temperature",
        data: [],
        borderColor: "#f6c23e",
        backgroundColor: "rgba(246, 194, 62, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3
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

        // Update chart data (limit to 20 data points for better visibility)
        setChartData((prev) => {
          const newLabels = [...prev.labels, new Date().toLocaleTimeString()];
          const newData = {
            labels: newLabels.length > 20 ? newLabels.slice(-20) : newLabels,
            datasets: [
              {
                ...prev.datasets[0],
                data: prev.datasets[0].data.length > 20 
                  ? [...prev.datasets[0].data.slice(-19), latestEntry.SoilMoisture]
                  : [...prev.datasets[0].data, latestEntry.SoilMoisture],
              },
              {
                ...prev.datasets[1],
                data: prev.datasets[1].data.length > 20 
                  ? [...prev.datasets[1].data.slice(-19), latestEntry.Humidity]
                  : [...prev.datasets[1].data, latestEntry.Humidity],
              },
              {
                ...prev.datasets[2],
                data: prev.datasets[2].data.length > 20 
                  ? [...prev.datasets[2].data.slice(-19), latestEntry.RainDrop]
                  : [...prev.datasets[2].data, latestEntry.RainDrop],
              },
              {
                ...prev.datasets[3],
                data: prev.datasets[3].data.length > 20 
                  ? [...prev.datasets[3].data.slice(-19), latestEntry.Temperature]
                  : [...prev.datasets[3].data, latestEntry.Temperature],
              },
            ],
          };
          return newData;
        });
      }
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Nunito', sans-serif"
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="min-vh-100" style={{
      background: "linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url('https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xl={10}>
            <Card className="shadow-lg border-0 mb-4">
              <Card.Header className="bg-primary text-white py-3">
                <h2 className="mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Real-Time Farm Monitoring Dashboard
                </h2>
              </Card.Header>
              <Card.Body className="p-4">
                {sensorData ? (
                  <Row>
                    <Col md={6} lg={3} className="mb-4 mb-lg-0">
                      <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Soil Moisture
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {sensorData.SoilMoisture} mm
                              </div>
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-tint fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6} lg={3} className="mb-4 mb-lg-0">
                      <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Humidity
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {sensorData.Humidity}%
                              </div>
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-percent fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6} lg={3} className="mb-4 mb-md-0">
                      <div className="card border-left-danger shadow h-100 py-2">
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                Rain Drop
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {sensorData.RainDrop} mm
                              </div>
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-cloud-rain fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6} lg={3}>
                      <div className="card border-left-warning shadow h-100 py-2">
                        <div className="card-body">
                          <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                              <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                Temperature
                              </div>
                              <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {sensorData.Temperature}°C
                              </div>
                            </div>
                            <div className="col-auto">
                              <i className="fas fa-thermometer-half fa-2x text-gray-300"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading sensor data...</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white py-3">
                <h2 className="mb-0">
                  <i className="fas fa-chart-area me-2"></i>
                  Sensor Data Trends
                </h2>
              </Card.Header>
              <Card.Body className="p-4">
                <div style={{ height: '400px' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </Card.Body>
              <Card.Footer className="bg-light text-center py-2">
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  Last updated: {new Date().toLocaleString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Feature1;