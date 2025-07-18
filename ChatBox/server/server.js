
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const socketAuth = require('./middleware/socketAuth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io connection handling
io.use(socketAuth);

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);
  
  // Store user connection
  connectedUsers.set(socket.userId, {
    socketId: socket.id,
    userId: socket.userId,
    username: socket.username
  });

  // Broadcast updated user list
  io.emit('users:update', Array.from(connectedUsers.values()));

  // Join user to rooms
  socket.on('room:join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user:joined', {
      userId: socket.userId,
      username: socket.username
    });
  });

  // Handle new messages
  socket.on('message:send', async (messageData) => {
    try {
      const Message = require('./models/Message');
      const message = new Message({
        content: messageData.content,
        sender: socket.userId,
        room: messageData.roomId,
        timestamp: new Date()
      });
      
      await message.save();
      await message.populate('sender', 'username');
      
      io.to(messageData.roomId).emit('message:new', {
        id: message._id,
        content: message.content,
        sender: message.sender,
        room: message.room,
        timestamp: message.timestamp
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing:start', (roomId) => {
    socket.to(roomId).emit('user:typing', {
      userId: socket.userId,
      username: socket.username
    });
  });

  socket.on('typing:stop', (roomId) => {
    socket.to(roomId).emit('user:stop_typing', {
      userId: socket.userId,
      username: socket.username
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
    connectedUsers.delete(socket.userId);
    io.emit('users:update', Array.from(connectedUsers.values()));
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
