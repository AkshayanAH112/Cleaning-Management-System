require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

async function updateBookings() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cleaningdb');
  const result = await Booking.updateMany(
    { $or: [{ status: { $exists: false } }, { status: null }] },
    { $set: { status: 'pending' } }
  );
  console.log(`Updated ${result.modifiedCount} bookings to have status 'pending'.`);
  await mongoose.disconnect();
}

updateBookings();
