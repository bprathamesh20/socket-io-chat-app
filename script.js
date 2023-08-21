const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

 

io.on('connection', (socket) => {
  console.log('Someone joined the chat');
  
  // ... Other code for handling messages and communication ...
});

server.listen(3000, () => {
  console.log('listning on port 3000');
});
