const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, requireDisclaimer } = require('../middleware/authMiddleware');
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  renewItem,
  deleteItem,
  getMyListings,
} = require('../controllers/itemController');

// Public listing browsing
router.get('/', getItems);
router.get('/user/my-listings', protect, getMyListings);
router.get('/:id', getItemById);

// Protected actions requiring auth & accepted disclaimer
router.post('/', protect, requireDisclaimer, upload.array('images', 5), createItem);
router.put('/:id', protect, requireDisclaimer, upload.array('images', 5), updateItem);
router.put('/:id/status', protect, updateItemStatus);
router.put('/:id/renew', protect, renewItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
