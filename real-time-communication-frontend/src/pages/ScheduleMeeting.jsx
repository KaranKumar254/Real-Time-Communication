import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { meetingService } from "../services/meetingService";
import "./ScheduleMeeting.css";

export default function ScheduleMeeting() {
  const navigate = useNavigate();
  const username = localStorage.getItem("rtcUser"); // 🔑 creator

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: 30,
  });

  const handleSchedule = async () => {
    if (!form.title || !form.date || !form.time) {
      alert("All fields are required");
      return;
    }

    const dateTime = new Date(`${form.date}T${form.time}`);

    try {
      await meetingService.createMeeting({
        title: form.title,
        dateTime,
        duration: form.duration,
        createdBy: username, // ✅ VERY IMPORTANT
      });

      alert("Meeting scheduled successfully");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="schedule-page">
      <div className="schedule-card">
        <h2>Schedule Meeting</h2>
        <p className="schedule-subtitle">
          Create a meeting for later
        </p>

        <div className="schedule-form">
          <label>Meeting Title</label>
          <input
            placeholder="Enter meeting title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <label>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <label>Time</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
          />

          <label>Duration (minutes)</label>
          <input
            type="number"
            min="5"
            value={form.duration}
            onChange={(e) =>
              setForm({
                ...form,
                duration: e.target.value,
              })
            }
          />

          <button
            className="schedule-btn"
            onClick={handleSchedule}
          >
            Schedule Meeting
          </button>
        </div>

        <div className="schedule-footer">
          <button onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
