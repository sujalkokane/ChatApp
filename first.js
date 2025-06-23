const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Notify others
  socket.broadcast.emit("user connected", "A new user has joined the chat");

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  // Notify others on disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    socket.broadcast.emit("user disconnected", "A user has left the chat");
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
