const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  registerUser,
  sendOTP,
  verifyOTP,
  loginUser,
  logoutUser,
  resetPassword,
} = require('../controllers/authController');

// Registration with optional profile photo upload
router.post('/register', upload.single('profilePhoto'), registerUser);

// OTP generation & verification
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Authentication session
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Password recovery
router.post('/reset-password', resetPassword);

module.exports = router;

