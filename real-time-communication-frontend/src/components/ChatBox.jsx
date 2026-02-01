import { useEffect, useState } from "react";
import { socket } from "../services/socket";

export default function ChatBox() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.emit("join-room", { roomId: "demo-room" });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;

    const messageData = {
      user: "You",
      text: msg,
    };

    socket.emit("send-message", messageData);
    setMsg("");
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.user}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
