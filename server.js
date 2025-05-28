const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const app = next({ dev: true });
const handle = app.getRequestHandler();

const users = {}; // username => socket.id

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected");

    socket.on("register_user", (username) => {
      users[username] = socket.id;
      socket.data.username = username;
      console.log(`👤 User registered: ${username}`);
    });

    socket.on("message", (msg) => {
      console.log("💬 Message:", msg);
      io.emit("message", `Someone said: ${msg}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
