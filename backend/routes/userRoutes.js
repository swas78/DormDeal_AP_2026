const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  getMe,
  updateProfile,
  acceptDisclaimer,
  getUserReputation,
} = require('../controllers/userController');

router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.put('/accept-disclaimer', protect, acceptDisclaimer);
router.get('/:id/reputation', getUserReputation);

module.exports = router;
