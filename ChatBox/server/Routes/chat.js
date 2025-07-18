
const express = require('express');
const Room = require('../models/Room');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ type: 'public' })
      .populate('creator', 'username')
      .select('name description type participants creator createdAt');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create room
router.post('/rooms', auth, async (req, res) => {
  try {
    const { name, description, type = 'public' } = req.body;
    
    const room = new Room({
      name,
      description,
      type,
      creator: req.user.userId,
      participants: [req.user.userId]
    });

    await room.save();
    await room.populate('creator', 'username');

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for a room
router.get('/rooms/:roomId/messages', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ room: roomId })
      .populate('sender', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
