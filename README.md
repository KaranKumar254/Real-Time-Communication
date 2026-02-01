# 🚀 Real-Time Communication App

A full-stack real-time video conferencing and collaboration application built using **React, Node.js, WebRTC, and Socket.IO**.  
This project supports **user authentication**, **instant and scheduled meetings**, **multi-user video calls**, **real-time chat**, and **meeting management** with a modern UI.

---

## ✨ Features

- 🔐 User Authentication (Login & Register)
- 🎥 Real-time Video & Audio Calling (WebRTC)
- 🧑‍🤝‍🧑 Multi-user Meetings with Socket.IO signaling
- 💬 Real-time Chat inside meetings
- 📅 Schedule Meetings for later
- 📋 View all scheduled meetings
- ❌ Delete meetings (creator only)
- 🚪 Join meetings using meeting code
- 🎨 Modern & responsive UI

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- WebRTC (Media & Peer Connection)
- Socket.IO Client
- CSS (Modern UI)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication

---

---

## ⚙️ How It Works

1. User logs in or registers
2. User lands on dashboard
3. User can:
   - Start a new instant meeting
   - Join an existing meeting
   - Schedule a meeting
   - View & delete scheduled meetings
4. WebRTC handles video/audio streaming
5. Socket.IO handles signaling (offer, answer, ICE)
6. MongoDB stores users & meetings

---

## ▶️ How to Run Locally

### Backend
```bash
cd backend
npm install
npm start


---

### 🔹 Step-by-Step Flow

#### 1️⃣ Authentication
- User logs in / registers
- Backend verifies user
- Token + username stored in browser

#### 2️⃣ Dashboard
- User chooses:
  - New Meeting
  - Join Meeting
  - Schedule Meeting
  - View Meetings

#### 3️⃣ Meeting Creation
- Backend generates a `meetingId`
- Meeting saved in MongoDB

#### 4️⃣ Joining a Meeting
- User navigates to `/room/:roomId`
- Socket.IO joins the room

#### 5️⃣ WebRTC Connection
- User A joins → waits
- User B joins → `user-joined` event
- Offer → Answer → ICE exchange
- Direct peer-to-peer media stream starts

#### 6️⃣ Chat
- Messages sent via Socket.IO
- Stored in state (real-time)

---

### 🔐 Security Design
- Authentication via backend
- Meeting deletion allowed **only to creator**
- Media streams are **peer-to-peer**, not stored on server

---

## 🎯 Why This Project is Important (for Interview)

- Demonstrates **real-time systems**
- Uses **WebRTC (advanced topic)**
- Shows **full-stack architecture**
- Covers **authentication, database, sockets**
- Solves real-world problems (meetings, scheduling)

---

## 🏁 Final Note

This project was built to understand **real-time communication systems** and how modern video conferencing apps work internally.

---

## 🙌 Author
**Karan Kumar**
<img width="949" height="436" alt="Screenshot 2026-02-01 223038" src="https://github.com/user-attachments/assets/f8e6752d-79b5-4a34-8177-462b145e96ac" />
