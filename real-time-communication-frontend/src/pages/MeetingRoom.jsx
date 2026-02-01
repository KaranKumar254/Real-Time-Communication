import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import "./MeetingRoom.css";
import { socket } from "../services/socket";

const RTC_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function MeetingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peersRef = useRef({});

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  console.log("✅ MeetingRoom loaded with roomId:", roomId);

  /* ================= START CAMERA (SAFE) ================= */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera/Mic permission denied");
      console.error(err);
    }
  };

  /* ================= CREATE PEER ================= */
  const createPeer = useCallback(
    (remoteSocketId) => {
      const pc = new RTCPeerConnection(RTC_CONFIG);

      streamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, streamRef.current);
      });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            roomId,
            candidate: e.candidate,
          });
        }
      };

      pc.ontrack = (e) => {
        const remoteVideo = document.createElement("video");
        remoteVideo.srcObject = e.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;
        remoteVideo.className = "remote-video";

        document
          .getElementById("remote-videos")
          ?.appendChild(remoteVideo);
      };

      peersRef.current[remoteSocketId] = pc;
      return pc;
    },
    [roomId]
  );

  /* ================= SOCKET + WEBRTC ================= */
  useEffect(() => {
    if (!roomId) return;

    startCamera();

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", roomId);

    socket.on("user-joined", async (remoteId) => {
      const pc = createPeer(remoteId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
    });

    socket.on("offer", async ({ offer, from }) => {
      const pc = createPeer(from);
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ answer, from }) => {
      const pc = peersRef.current[from];
      if (pc) await pc.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      const pc = peersRef.current[from];
      if (pc) await pc.addIceCandidate(candidate);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off();
      socket.disconnect();
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId, createPeer]);

  /* ================= CONTROLS ================= */
  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const toggleCamera = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  const toggleScreenShare = async () => {
    if (!screenOn) {
      try {
        const screenStream =
          await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });

        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = screenStream;
        videoRef.current.srcObject = screenStream;
        setScreenOn(true);

        screenStream.getVideoTracks()[0].onended = () => {
          setScreenOn(false);
          startCamera();
        };
      } catch {
        alert("Screen share cancelled");
      }
    } else {
      setScreenOn(false);
      startCamera();
    }
  };

  /* ================= CHAT ================= */
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      user: localStorage.getItem("rtcUser"),
      text: message,
    };

    socket.emit("send-message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  /* ================= LEAVE ================= */
  const leaveMeeting = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    navigate("/dashboard");
  };

  return (
    <div className="meeting-page">
      <header className="meeting-header">
        <h2>Meeting Room</h2>
        <span className="room-code">Room: {roomId}</span>
      </header>

      <div className="meeting-body">
        <div className={`video-area ${showChat ? "shrink" : ""}`}>
          <div className="video-tile live">
            <video ref={videoRef} autoPlay muted playsInline />
            <span className="name-badge">You</span>
          </div>

          <div id="remote-videos" className="remote-grid" />
        </div>

        {showChat && (
          <div className="chat-panel">
            <h3>Chat</h3>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className="chat-message">
                  <strong>{m.user}:</strong> {m.text}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>

      <div className="control-bar">
        <button onClick={toggleMic}>{micOn ? "🎤" : "🔇"}</button>
        <button onClick={toggleCamera}>{camOn ? "📷" : "🚫"}</button>
        <button onClick={toggleScreenShare}>
          {screenOn ? "❌" : "🖥"}
        </button>
        <button onClick={() => setShowChat(!showChat)}>💬</button>
        <button className="leave" onClick={leaveMeeting}>
          🚪 Leave
        </button>
      </div>
    </div>
  );
}
