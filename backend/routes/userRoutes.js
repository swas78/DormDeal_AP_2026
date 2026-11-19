const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  getMe,
  updateProfile,
  acceptDisclaimer,
} = require('../controllers/userController');

// All user routes require valid authentication
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.put('/accept-disclaimer', protect, acceptDisclaimer);

module.exports = router;

