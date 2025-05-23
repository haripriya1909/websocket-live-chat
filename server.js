const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const app = next({ dev: false }); // Set dev: false for production
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

    socket.on("message", (msg) => {
      console.log("💬 Message:", msg);
      // Broadcast to all clients except sender
      socket.broadcast.emit("message", `Someone said: ${msg}`);
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
