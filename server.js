const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

let onlineUsers = [];

io.on("connection", socket => {
  console.log("A user connected");

  socket.on("joinChat", username => {
    socket.username = username; // Store the username in the socket object

    onlineUsers.push(username); // Add the username to the list of online users
    io.emit("onlineUsers", onlineUsers); // Emit updated online users list
  });

  socket.on("message", message => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    if (socket.username) {
      onlineUsers = onlineUsers.filter(user => user !== socket.username); // Remove disconnected user
      io.emit("onlineUsers", onlineUsers); // Emit updated online users list
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
