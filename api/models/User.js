const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['candidate', 'employee', 'admin'], default: 'candidate' },
  imagePath: { type: String },
  otp: { type: Number }, // OTP for verification
});

module.exports = mongoose.model('User', userSchema);
