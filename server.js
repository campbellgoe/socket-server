const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: 'http://localhost:3030', // Replace '*' with your frontend URL in production
      methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('chat_message', (msg) => {
      console.log('chat message received by server:', msg)
        io.emit('chat_message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});