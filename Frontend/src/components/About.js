import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap'; // If you want to use Bootstrap components

const About = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h1>About Agro Website</h1>
          <p>
            Welcome to Agro! Our website is dedicated to providing essential information and services related to agriculture. 
            Whether you're a farmer, a supplier, or just someone interested in the latest agricultural trends, Agro has everything 
            you need to stay informed and improve your agricultural practices.
          </p>

          <h3>Our Mission</h3>
          <p>
            Our mission is to empower farmers and agricultural businesses by offering easy access to up-to-date resources, tools, 
            and technologies that drive efficiency and sustainability in farming.
          </p>

          <h3>Key Features</h3>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Farming Tools</Card.Title>
                  <Card.Text>
                    We provide the latest tools to help farmers improve productivity and reduce costs.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Market Insights</Card.Title>
                  <Card.Text>
                    Get the latest insights into market trends, crop prices, and more.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Expert Advice</Card.Title>
                  <Card.Text>
                    Connect with agricultural experts for advice on best farming practices and crop management.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h3>Contact Us</h3>
          <p>
            If you have any questions or need further information, feel free to reach out to our team at info@agro.com.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
