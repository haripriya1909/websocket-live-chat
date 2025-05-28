"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io("https://websocket-live-chat.onrender.com");

    socket.on("receive_message", ({ sender, message }) => {
      setMessages((prev) => [...prev, `${sender}: ${message}`]);
    });

    return () => socket.disconnect();
  }, []);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", { room, username });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, `You: ${input}`]);
      socket.emit("send_message", { room, message: input, sender: username });
      setInput("");
    }
  };

  if (!joined) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Join Chat Room</h2>
        <input
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          placeholder="Room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>💬 Room: {room}</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            padding: "8px",
            marginRight: "10px",
            width: "70%",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 16px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
