const express = require('express');
const router = express.Router();
const { protect, requireDisclaimer } = require('../middleware/authMiddleware');
const {
  getBroadcasts,
  createBroadcast,
  matchBroadcast,
  getMyBroadcasts,
  deleteBroadcast,
} = require('../controllers/broadcastController');

router.get('/', getBroadcasts);
router.get('/my-broadcasts', protect, getMyBroadcasts);
router.post('/', protect, requireDisclaimer, createBroadcast);
router.post('/:id/match', protect, matchBroadcast);
router.post('/:id/fulfill', protect, matchBroadcast);
router.delete('/:id', protect, deleteBroadcast);

module.exports = router;
