require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const meetingRoutes = require("./routes/meeting.routes");
const socketHandler = require("./socket/socket");

// ✅ APP INITIALIZE FIRST
const app = express();
const server = http.createServer(app);

// ✅ SOCKET.IO INIT
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ DATABASE
connectDB();

// ✅ MIDDLEWARE (BEFORE ROUTES)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 RTC Backend Running");
});

// ✅ SOCKET HANDLER
socketHandler(io);

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
