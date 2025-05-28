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

    socket.on("join_room", ({ room, username }) => {
      socket.join(room);
      socket.data.username = username;
      socket.data.room = room;
      console.log(`👤 ${username} joined room: ${room}`);
    });

    socket.on("send_message", ({ room, message, sender }) => {
      // Send message only to others in room, not sender
      socket.to(room).emit("receive_message", {
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
