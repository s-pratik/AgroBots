import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap";

const CropRecommendation = () => {
    const [formData, setFormData] = useState({
        N: "",
        P: "",
        K: "",
        temperature: "",
        humidity: "",
        ph: "",
        rainfall: ""
    });
    const [recommendedCrop, setRecommendedCrop] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getPrediction = async () => {
        try {
            setError("");
            setRecommendedCrop("Analyzing data... 🌱");
            
            const response = await axios.post("http://127.0.0.1:5000/predict", formData);
            setRecommendedCrop(`Best crop: ${response.data.recommended_crop} 🌾`);
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to get recommendation. Please try again.");
            setRecommendedCrop("");
        }
    };

    return (
        <div className="min-vh-100" style={{
            background: "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
        }}>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-lg border-success">
                            <Card.Header className="bg-success text-white">
                                <h2 className="text-center mb-0">
                                    <i className="fas fa-seedling me-2"></i>
                                    Smart Crop Recommendation
                                </h2>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Form>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-atom me-2 text-primary"></i>
                                                    Nitrogen (N)
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    name="N" 
                                                    value={formData.N} 
                                                    onChange={handleChange}
                                                    placeholder="Enter N value"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-fire me-2 text-danger"></i>
                                                    Phosphorus (P)
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    name="P" 
                                                    value={formData.P} 
                                                    onChange={handleChange}
                                                    placeholder="Enter P value"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-bolt me-2 text-warning"></i>
                                                    Potassium (K)
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    name="K" 
                                                    value={formData.K} 
                                                    onChange={handleChange}
                                                    placeholder="Enter K value"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-thermometer-half me-2 text-info"></i>
                                                    Temperature (°C)
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    name="temperature" 
                                                    value={formData.temperature} 
                                                    onChange={handleChange}
                                                    placeholder="Enter temperature"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-tint me-2 text-info"></i>
                                                    Humidity (%)
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    name="humidity" 
                                                    value={formData.humidity} 
                                                    onChange={handleChange}
                                                    placeholder="Enter humidity"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-water me-2 text-primary"></i>
                                                    pH Level
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    name="ph" 
                                                    value={formData.ph} 
                                                    onChange={handleChange}
                                                    placeholder="Enter pH level"
                                                    step="0.1"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            <i className="fas fa-cloud-rain me-2 text-primary"></i>
                                            Rainfall (mm)
                                        </Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            name="rainfall" 
                                            value={formData.rainfall} 
                                            onChange={handleChange}
                                            placeholder="Enter rainfall"
                                        />
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button 
                                            variant="success" 
                                            size="lg"
                                            onClick={getPrediction}
                                            className="fw-bold"
                                        >
                                            <i className="fas fa-magic me-2"></i>
                                            Recommend Crop
                                        </Button>
                                    </div>
                                </Form>

                                {recommendedCrop && !error && (
                                    <Alert variant="success" className="mt-4 text-center">
                                        <h4 className="mb-0">
                                            <i className="fas fa-check-circle me-2"></i>
                                            {recommendedCrop}
                                        </h4>
                                    </Alert>
                                )}

                                {error && (
                                    <Alert variant="danger" className="mt-4 text-center">
                                        <h4 className="mb-0">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {error}
                                        </h4>
                                    </Alert>
                                )}
                            </Card.Body>
                            <Card.Footer className="bg-light text-center text-muted">
                                <small>Enter your soil and climate data to get the best crop recommendation</small>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CropRecommendation;