import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { authService } from "../services/authService";
import { meetingService } from "../services/meetingService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [meetings, setMeetings] = useState([]);

  /* 🔐 LOGIN CHECK */
  useEffect(() => {
    const token = localStorage.getItem("rtcToken");
    const user = localStorage.getItem("rtcUser");

    if (!token || !user) {
      navigate("/");
    } else {
      setUsername(user);
    }
  }, [navigate]);

  /* 📅 LOAD SCHEDULED MEETINGS */
  useEffect(() => {
    meetingService
      .getMeetings()
      .then(setMeetings)
      .catch(console.error);
  }, []);

  /* ➕ CREATE INSTANT MEETING */
  const createMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/meeting/${roomId}`);
  };

  /* 🔑 JOIN MEETING */
  const joinMeeting = () => {
    if (!roomCode.trim()) {
      alert("Please enter a valid meeting code");
      return;
    }
    navigate(`/meeting/${roomCode}`);
  };

  /* 🚪 LOGOUT */
  const logout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>Real Time Communication</h1>

        <div className="header-right">
          <span className="user-name">👤 {username}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="dashboard-main">
        <h2>Welcome, {username} 👋</h2>
        <p className="dashboard-subtitle">
          Start or manage your video meetings
        </p>

        {/* DASHBOARD CARDS */}
        <div className="dashboard-cards">
          {/* NEW MEETING */}
          <div className="dashboard-card" onClick={createMeeting}>
            <span>➕</span>
            <h3>New Meeting</h3>
            <p>Create an instant meeting</p>
          </div>

          {/* JOIN MEETING */}
          <div
            className="dashboard-card"
            onClick={() => setShowJoin(true)}
          >
            <span>🔑</span>
            <h3>Join Meeting</h3>
            <p>Join using meeting code</p>
          </div>

          {/* SCHEDULE MEETING */}
          <div
            className="dashboard-card schedule"
            onClick={() => navigate("/schedule")}
          >
            <span>📅</span>
            <h3>Scheduled</h3>
            <p>Create & view scheduled meetings</p>
          </div>
        </div>

        {/* UPCOMING MEETINGS */}
        <section className="upcoming-section">
          <h3>📅 Upcoming Meetings</h3>

          {meetings.length === 0 && (
            <p className="empty-text">No scheduled meetings</p>
          )}

          <div className="upcoming-list">
            {meetings.slice(0, 3).map((m) => {
              const canJoin = new Date() >= new Date(m.dateTime);

              return (
                <div className="upcoming-card" key={m.meetingId}>
                  <div>
                    <h4>{m.title}</h4>
                    <p>
                      {new Date(m.dateTime).toLocaleString()}
                    </p>
                  </div>

                  <button
                    disabled={!canJoin}
                    onClick={() =>
                      navigate(`/meeting/${m.meetingId}`)
                    }
                  >
                    {canJoin ? "Join" : "Not started"}
                  </button>
                </div>
              );
            })}
          </div>

          {meetings.length > 3 && (
            <button
              className="view-all-btn"
              onClick={() => navigate("/my-meetings")}
            >
              View All
            </button>
          )}
        </section>
      </main>

      {/* JOIN MEETING MODAL */}
      {showJoin && (
        <div className="modal-overlay">
          <div className="join-modal">
            <h3>Join Meeting</h3>
            <p>Enter meeting code</p>

            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="e.g. a1b2c3"
            />

            <div className="modal-actions">
              <button onClick={joinMeeting}>Join</button>
              <button
                className="cancel-btn"
                onClick={() => setShowJoin(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
