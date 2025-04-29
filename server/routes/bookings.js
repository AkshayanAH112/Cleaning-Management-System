const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// Admin only middleware
function adminOnly(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).json({ msg: 'Admin only' });
  next();
}

// Get all bookings for logged-in user (or all if admin)
router.get('/', auth, async (req, res) => {
  let filter = req.user.isAdmin ? {} : { user_id: req.user.userId };
  const bookings = await Booking.find(filter).populate('service_id').populate('user_id', 'username');
  res.json(bookings);
});

// Add a new booking
router.post('/', auth, async (req, res) => {
  const { customer_name, address, date_time, service_id } = req.body;
  if (!customer_name || !address || !date_time || !service_id) {
    return res.status(400).json({ msg: 'All fields required' });
  }
  const booking = new Booking({
    customer_name,
    address,
    date_time,
    service_id,
    user_id: req.user.userId
  });
  await booking.save();
  res.status(201).json(booking);
});

// Update a booking (only if pending)
router.put('/:id', auth, async (req, res) => {
  const { customer_name, address, date_time, service_id } = req.body;
  const booking = await Booking.findOne({ _id: req.params.id, user_id: req.user.userId });
  if (!booking) return res.status(404).json({ msg: 'Booking not found or not authorized' });
  if (booking.status !== 'pending') return res.status(400).json({ msg: 'Cannot edit booking after it is accepted or declined by admin' });
  booking.customer_name = customer_name;
  booking.address = address;
  booking.date_time = date_time;
  booking.service_id = service_id;
  await booking.save();
  res.json(booking);
});

// Delete a booking (only if pending)
router.delete('/:id', auth, async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user_id: req.user.userId });
  if (!booking) return res.status(404).json({ msg: 'Booking not found or not authorized' });
  if (booking.status !== 'pending') return res.status(400).json({ msg: 'Cannot cancel booking after it is accepted or declined by admin' });
  await booking.deleteOne();
  res.json({ msg: 'Booking canceled' });
});

// Admin: Accept or decline a booking
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  const { status } = req.body; // 'accepted' or 'declined'
  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ msg: 'Booking not found' });
  booking.status = status;
  await booking.save();
  res.json(booking);
});

module.exports = router;
