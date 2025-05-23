"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Home() {
  // State management using React hooks
  const [input, setInput] = useState(""); // State for the message input field
  const [messages, setMessages] = useState([]); // State for storing chat messages

  // useEffect hook runs when component mounts
  useEffect(() => {
    // Initialize socket connection
    socket = io(); // Connects to the Socket.IO server

    // Set up event listener for incoming messages
    socket.on("message", (msg) => {
      // When a message is received, add it to the messages array
      setMessages((prev) => [...prev, msg]); // Spread operator to keep existing messages
    });

    // Cleanup function runs when component unmounts
    return () => {
      socket.disconnect(); // Disconnect socket to prevent memory leaks
    };
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle sending messages
  const sendMessage = () => {
    if (input.trim()) {
      // Only send if message isn't empty
      socket.emit("message", input); // Send message to server
      setInput(""); // Clear input field after sending
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
          }}>
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
        }}>
        {/* Map through messages array to display each message */}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
