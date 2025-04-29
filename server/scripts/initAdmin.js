require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cleaningdb');
  const email = 'admin@cleaning.com';
  const password = 'admin123';
  const first_name = 'Admin';
  const last_name = 'User';
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const password_hash = await bcrypt.hash(password, 10);
  const admin = new User({ first_name, last_name, email, password_hash, isAdmin: true });
  await admin.save();
  console.log('Admin created:', email, 'Password:', password);
  process.exit(0);
}

createAdmin();
