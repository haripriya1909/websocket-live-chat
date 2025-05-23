"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to your deployed backend
    socket = io("https://websocket-live-chat.onrender.com");

    // Listen for incoming messages from server
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      // Show your message instantly in UI
      setMessages((prev) => [...prev, `You: ${input}`]);

      // Send message to server
      socket.emit("message", input);

      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>💬 Live Chat</h1>

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
