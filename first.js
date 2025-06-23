const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Store usernames for each socket
const users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  // When user sends their name
  socket.on("set username", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("user connected", `${username} has joined the chat`);
  });

  // When user sends a chat message
  socket.on("chat message", (msg) => {
    const username = users[socket.id] || "Anonymous";
    io.emit("chat message", `${username}: ${msg}`);
  });

  // When user disconnects
  socket.on("disconnect", () => {
    const username = users[socket.id] || "A user";
    socket.broadcast.emit("user disconnected", `${username} has left the chat`);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

