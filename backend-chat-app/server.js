const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// In-memory message store
const messages = [];

// Health check route
app.get("/", (req, res) => {
  res.send("Chat backend is running 🚀");
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 1. Send existing messages when user joins
  socket.emit("load_messages", messages);

  // 2. Receive new message from client
  socket.on("send_message", (data) => {
    const message = {
      id: Date.now(), // extra feature: unique message ID
      username: data.username,
      text: data.text,
      time: new Date().toLocaleTimeString(), // extra feature: server timestamp
    };

    // Save message
    messages.push(message);

    // Broadcast to ALL users
    io.emit("receive_message", message);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
