import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MeetingRoom from "./pages/MeetingRoom";
import ScheduleMeeting from "./pages/ScheduleMeeting";
import MyMeetings from "./pages/MyMeetings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<ScheduleMeeting />} />
        <Route path="/my-meetings" element={<MyMeetings />} />
        <Route path="/room/:roomId" element={<MeetingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
