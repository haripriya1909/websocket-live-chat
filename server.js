const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const app = next({ dev: true });
const handle = app.getRequestHandler();
//first prepare next js application then create server
app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res)); //handshake between client and server
  const io = new Server(server); //socket server created

  io.on("connection", (socket) => {
    //new client connect hua
    console.log("🟢 Client connected");

    socket.on("message", (msg) => {
      //client sends a message
      console.log("💬 Message:", msg);
      io.emit("message", `Someone said: ${msg}`);
    });

    socket.on("disconnect", () => {
      //client disconnected
      console.log("🔴 Client disconnected");
    });
  });

  server.listen(3001, () => {
    console.log("🚀 Server ready on http://localhost:3001");
  });
});
