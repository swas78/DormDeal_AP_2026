const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['registration', 'verification', 'password_reset'],
    default: 'registration',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Document automatically deletes after 5 minutes (300 seconds)
  },
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;

