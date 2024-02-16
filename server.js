const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("offer", (offer) => {
    // Handle offer received from the host
    io.emit("offer", offer); // Broadcast offer to all clients
  });

  socket.on("answer", (answer) => {
    // Handle answer received from a viewer
    io.emit("answer", answer); // Broadcast answer to all clients
  });

  socket.on("iceCandidate", (iceCandidate) => {
    // Handle ICE candidate received from the host or a viewer
    io.emit("iceCandidate", iceCandidate); // Broadcast ICE candidate to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Signaling server running on port 3000");
});
