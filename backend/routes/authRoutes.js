const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  sendOTP,
  verifyOTP,
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
} = require('../controllers/authController');

router.post('/register', upload.single('profilePhoto'), registerUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/reset-password', resetPassword);

module.exports = router;
