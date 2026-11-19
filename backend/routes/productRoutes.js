const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, requireDisclaimer } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings,
} = require('../controllers/productController');

// Public listing browsing
router.get('/', getProducts);

// Current user's own listings
router.get('/user/my-listings', protect, getMyListings);

// Single product details
router.get('/:id', getProductById);

// Protected routes requiring authentication & accepted campus disclaimer
router.post(
  '/',
  protect,
  requireDisclaimer,
  upload.array('images', 5),
  createProduct
);

router.put(
  '/:id',
  protect,
  requireDisclaimer,
  upload.array('images', 5),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  requireDisclaimer,
  deleteProduct
);

module.exports = router;

