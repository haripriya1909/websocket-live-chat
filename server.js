const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected");

    // ✅ Join a room
    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      console.log(`👤 Joined room: ${roomName}`);
    });

    // ✅ Receive and forward messages to a room
    socket.on("send_message", ({ roomName, message, sender }) => {
      console.log(`💬 ${sender} in ${roomName}: ${message}`);

      io.to(roomName).emit("receive_message", {
        sender,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server ready on port ${PORT}`);
  });
});
