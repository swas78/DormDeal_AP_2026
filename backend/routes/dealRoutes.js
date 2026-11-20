const express = require('express');
const router = express.Router();
const { protect, requireDisclaimer } = require('../middleware/authMiddleware');
const {
  createDeal,
  getMyDeals,
  updateDealStatus,
} = require('../controllers/dealController');

router.get('/my-deals', protect, getMyDeals);
router.post('/', protect, requireDisclaimer, createDeal);
router.put('/:id/status', protect, updateDealStatus);

module.exports = router;
