const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { auth, adminOnly } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Get all users (admin only)
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password_hash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all bookings (admin only)
router.get('/bookings', auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('service_id')
      .populate('user_id', 'first_name last_name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a new user (admin only)
router.post('/users', auth, adminOnly, async (req, res) => {
  try {
    const { first_name, last_name, email, password, isAdmin } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    const user = new User({ first_name, last_name, email, password_hash, isAdmin: !!isAdmin });
    await user.save();
    res.status(201).json({ msg: 'User created', user: { ...user.toObject(), password_hash: undefined } });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ msg: 'Email already exists' });
    } else {
      res.status(500).json({ msg: 'Server error' });
    }
  }
});

// Edit a user (admin only)
router.put('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const { first_name, last_name, email, password, isAdmin } = req.body;
    const update = { first_name, last_name, email, isAdmin };
    if (password) {
      update.password_hash = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User updated', user: { ...user.toObject(), password_hash: undefined } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Decline a booking after acceptance (admin only)
router.put('/bookings/:id/decline', auth, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    if (booking.status !== 'accepted') {
      return res.status(400).json({ msg: 'Only accepted bookings can be declined' });
    }
    booking.status = 'declined';
    await booking.save();
    res.json({ msg: 'Booking declined', booking });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
