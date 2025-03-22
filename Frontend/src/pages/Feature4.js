import { useState, useEffect } from "react";
import { db } from "../../src/firebase"; // Import Firebase config
import { ref, set, get } from "firebase/database";

export default function IrrigationControl() {
  const [pumpState, setPumpState] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [pumpManual, setPumpManual] = useState(false); // State for PumpManual

  // Fetch current data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db) {
          console.error("Firebase database is not initialized.");
          return;
        }

        const pumpRef = ref(db, "SmartIrrigation/pumpState");
        const scheduleRef = ref(db, "SmartIrrigation/Schedule");
        const pumpManualRef = ref(db, "SmartIrrigation/PumpManual");

        const pumpSnap = await get(pumpRef);
        const scheduleSnap = await get(scheduleRef);
        const pumpManualSnap = await get(pumpManualRef);

        if (pumpSnap.exists()) setPumpState(pumpSnap.val());
        if (scheduleSnap.exists()) setScheduleTime(scheduleSnap.val());
        if (pumpManualSnap.exists()) setPumpManual(pumpManualSnap.val());
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, []);

  // Update Pump State in Firebase
  const togglePump = async (newState) => {
    try {
      await set(ref(db, "/SmartIrrigation/pumpState"), newState);
      setPumpState(newState); // Update local state
    } catch (error) {
      console.error("Error updating pump state:", error);
    }
  };

  // Update Scheduled Time in Firebase
  const updateSchedule = async (time) => {
    try {
      console.log("Updating schedule to:", time); // Log the time
      await set(ref(db, "SmartIrrigation/Schedule"), time);
      console.log("Schedule updated successfully in Firebase");
      setScheduleTime(time); // Update local state
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  // Toggle PumpManual between true and false
  const togglePumpManual = async () => {
    const newPumpManualState = !pumpManual; // Toggle the state
    try {
      await set(ref(db, "/SmartIrrigation/PumpManual"), newPumpManualState);
      setPumpManual(newPumpManualState); // Update local state
    } catch (error) {
      console.error("Error updating PumpManual:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title mb-0">Smart Irrigation Control</h2>
        </div>
        <div className="card-body">
          {/* Pump Control Buttons */}
          <div className="mb-4">
            <h5 className="mb-3">Pump Control</h5>
            <div className="d-flex gap-2">
              <button
                onClick={() => togglePump(true)}
                className="btn btn-danger flex-grow-1"
              >
                Turn OFF Pump
              </button>
              <button
                onClick={() => togglePump(false)}
                className="btn btn-success flex-grow-1"
              >
                Turn ON Pump
              </button>
            </div>
          </div>

          {/* Toggle PumpManual Button */}
          <div className="mb-4">
            <h5 className="mb-3">Manual Mode</h5>
            <button
              onClick={togglePumpManual}
              className={`btn w-100 ${pumpManual ? "btn-warning" : "btn-secondary"}`}
            >
              {pumpManual ? "Manual Mode (ON)" : "Manual Mode (OFF)"}
            </button>
          </div>

          {/* Schedule Irrigation Input */}
          <div className="mb-4">
            <h5 className="mb-3">Schedule Irrigation</h5>
            <div className="input-group">
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)} // Update local state
                className="form-control"
              />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => updateSchedule(scheduleTime)} // Call updateSchedule
              >
                Set Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}