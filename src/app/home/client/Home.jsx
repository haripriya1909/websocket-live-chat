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

    // Receive messages with sender info
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, `${data.sender}: ${data.message}`]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Step 1: Join a room
  const joinRoom = () => {
    if (username.trim() && room.trim()) {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  // Step 2: Send message with sender name and room
  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, `You: ${input}`]);

      socket.emit("send_message", {
        roomName: room,
        message: input,
        sender: username,
      });

      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>💬 Live Chat</h1>

      {!joined ? (
        <>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Your Name"
            style={{
              padding: "8px",
              marginRight: "10px",
              width: "70%",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          />
          <br />
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter Room Name"
            style={{
              padding: "8px",
              marginRight: "10px",
              width: "70%",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          />
          <br />
          <button
            onClick={joinRoom}
            style={{
              padding: "8px 16px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Join Room
          </button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: "20px", marginTop: "20px" }}>
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
        </>
      )}
    </div>
  );
}
