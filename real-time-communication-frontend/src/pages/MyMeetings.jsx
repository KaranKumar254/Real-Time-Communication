import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { meetingService } from "../services/meetingService";
import "./MyMeetings.css";

export default function MyMeetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const username = localStorage.getItem("rtcUser");

  useEffect(() => {
    meetingService
      .getMeetings()
      .then(setMeetings)
      .catch((err) => alert(err.message));
  }, []);

  // ✅ DELETE (CREATOR ONLY)
  const handleDelete = async (meetingId) => {
    if (!window.confirm("Delete this meeting?")) return;

    try {
      await meetingService.deleteMeeting(meetingId, username);
      setMeetings((prev) =>
        prev.filter((m) => m.meetingId !== meetingId)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="meetings-page">
      <h2>📅 Scheduled Meetings</h2>

      {meetings.length === 0 && (
        <p className="empty">No meetings scheduled</p>
      )}

      <div className="meetings-list">
        {meetings.map((m) => {
          const canJoin = new Date() >= new Date(m.dateTime);

          return (
            <div className="meeting-card" key={m.meetingId}>
              <div>
                <h3>{m.title}</h3>
                <p>🕒 {new Date(m.dateTime).toLocaleString()}</p>
                <p>⏱ {m.duration} minutes</p>
                <p className="creator">
                  👤 Created by: {m.createdBy}
                </p>
              </div>

              <div className="meeting-actions">
                {/* ✅ ROUTE FIXED HERE */}
                <button
                  disabled={!canJoin}
                  onClick={() =>
                    navigate(`/room/${m.meetingId}`)
                  }
                >
                  {canJoin ? "Join" : "Not Started"}
                </button>

                {/* ✅ DELETE ONLY FOR CREATOR */}
                {m.createdBy?.toLowerCase() ===
                  username?.toLowerCase() && (
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(m.meetingId)
                    }
                  >
                    ❌ Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
