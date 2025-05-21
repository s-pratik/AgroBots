import { useState, useEffect } from "react";
import { db } from "../../src/firebase";
import { ref, set, get } from "firebase/database";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function IrrigationControl() {
  const [pumpState, setPumpState] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [pumpManual, setPumpManual] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!db) {
          console.error("Firebase database is not initialized.");
          return;
        }

        const pumpRef = ref(db, "SmartIrrigation/pumpState");
        const scheduleRef = ref(db, "SmartIrrigation/Schedule");
        const pumpManualRef = ref(db, "SmartIrrigation/PumpManual");

        const [pumpSnap, scheduleSnap, pumpManualSnap] = await Promise.all([
          get(pumpRef),
          get(scheduleRef),
          get(pumpManualRef)
        ]);

        if (pumpSnap.exists()) setPumpState(pumpSnap.val());
        if (scheduleSnap.exists()) setScheduleTime(scheduleSnap.val());
        if (pumpManualSnap.exists()) setPumpManual(pumpManualSnap.val());
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update Pump State in Firebase
  const togglePump = async (newState) => {
    try {
      setIsLoading(true);
      await set(ref(db, "/SmartIrrigation/pumpState"), newState);
      setPumpState(newState);
    } catch (error) {
      console.error("Error updating pump state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Scheduled Time in Firebase
  const updateSchedule = async (time) => {
    try {
      setIsLoading(true);
      await set(ref(db, "SmartIrrigation/Schedule"), time);
      setScheduleTime(time);
    } catch (error) {
      console.error("Error updating schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle PumpManual
  const togglePumpManual = async () => {
    const newPumpManualState = !pumpManual;
    try {
      setIsLoading(true);
      await set(ref(db, "/SmartIrrigation/PumpManual"), newPumpManualState);
      setPumpManual(newPumpManualState);
    } catch (error) {
      console.error("Error updating PumpManual:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{
      background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat",
      paddingTop: "3rem",
      paddingBottom: "3rem"
    }}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="shadow-lg border-0 overflow-hidden">
              <Card.Header className="bg-success text-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="mb-0">
                    <i className="fas fa-tint me-2"></i>
                    Smart Irrigation Control
                  </h2>
                  {isLoading && (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </div>
              </Card.Header>
              
              <Card.Body className="p-4 bg-light">
                {/* Pump Status Indicator */}
                <div className="text-center mb-4">
                  <div className={`p-3 rounded-circle d-inline-block ${pumpState ? 'bg-danger' : 'bg-success'}`}>
                    <i className={`fas fa-power-off fa-3x text-white ${pumpState ? 'fa-rotate-180' : ''}`}></i>
                  </div>
                  <h4 className="mt-3">
                    Pump is currently: 
                    <span className={pumpState ? "text-danger" : "text-success"}>
                      {pumpState ? " ON" : " OFF"}
                    </span>
                  </h4>
                </div>

                {/* Pump Control Buttons - Original Version */}
                <div className="mb-4">
                  <h5 className="mb-3 text-center">
                    <i className="fas fa-sliders-h me-2"></i>
                    Pump Control
                  </h5>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => togglePump(true)}
                      className={`btn ${pumpState ? 'btn-danger' : 'btn-outline-danger'} flex-grow-1`}
                      disabled={isLoading}
                    >
                      Turn OFF Pump
                    </button>
                    <button
                      onClick={() => togglePump(false)}
                      className={`btn ${!pumpState ? 'btn-success' : 'btn-outline-success'} flex-grow-1`}
                      disabled={isLoading}
                    >
                      Turn ON Pump
                    </button>
                  </div>
                </div>

                {/* Manual Mode Toggle */}
                <div className="mb-4">
                  <h5 className="mb-3 text-center">
                    <i className="fas fa-hand-paper me-2"></i>
                    Operation Mode
                  </h5>
                  <button
                    onClick={togglePumpManual}
                    className={`btn w-100 ${pumpManual ? 'btn-warning' : 'btn-secondary'}`}
                    disabled={isLoading}
                  >
                    {pumpManual ? "Manual Mode (ON)" : "Manual Mode (OFF)"}
                  </button>
                </div>

                {/* Schedule Section */}
                <div className="mb-3">
                  <h5 className="mb-3 text-center">
                    <i className="far fa-clock me-2"></i>
                    Irrigation Schedule
                  </h5>
                  <div className="input-group">
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="form-control"
                      disabled={isLoading}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={() => updateSchedule(scheduleTime)}
                      disabled={isLoading}
                    >
                      Set Schedule
                    </button>
                  </div>
                  {scheduleTime && (
                    <div className="alert alert-info text-center mt-3">
                      <i className="far fa-bell me-2"></i>
                      Next irrigation scheduled for: <strong>{scheduleTime}</strong>
                    </div>
                  )}
                </div>
              </Card.Body>
              
              <Card.Footer className="bg-white text-center py-2">
                <small className="text-muted">
                  <i className="fas fa-sync-alt me-1"></i>
                  Last updated: {new Date().toLocaleTimeString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}