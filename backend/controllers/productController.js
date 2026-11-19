const Product = require('../models/Product');

/**
 * @desc    Get all marketplace products with filtering, search & sorting
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      seller,
      status,
      sort,
      page = 1,
      limit = 24,
    } = req.query;

    const query = {};

    // Search filter across title and description
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    // Condition filter
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Seller filter
    if (seller) {
      query.seller = seller;
    }

    // Availability status
    if (status) {
      query.status = status;
    }

    // Sort order
    let sortOptions = { createdAt: -1 }; // default newest first
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'fullName email phone enrollmentId profilePhoto')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product details by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'fullName email phone enrollmentId profilePhoto createdAt'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product listing
 * @route   POST /api/products
 * @access  Private (Seller must be logged in & disclaimer accepted)
 */
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, condition } = req.body;

    if (!title || !description || price === undefined || !category || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, price, category, and condition are all required.',
      });
    }

    // Handle images uploaded via Multer or sent as URLs
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.file) {
      images = [`/uploads/${req.file.filename}`];
    } else if (req.body.imageUrl) {
      images = Array.isArray(req.body.imageUrl) ? req.body.imageUrl : [req.body.imageUrl];
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      condition,
      images,
      seller: req.user._id,
      status: 'Available',
    });

    const populatedProduct = await Product.findById(product._id).populate(
      'seller',
      'fullName email phone enrollmentId profilePhoto'
    );

    return res.status(201).json({
      success: true,
      message: 'Product listed successfully on CampusKart!',
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product listing
 * @route   PUT /api/products/:id
 * @access  Private (Owner only)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Security check: restrict user to updating only their own products
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are only authorized to edit your own listings.',
      });
    }

    const { title, description, price, category, condition, status } = req.body;

    if (title) product.title = title.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (category) product.category = category;
    if (condition) product.condition = condition;
    if (status) product.status = status;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    } else if (req.file) {
      product.images.push(`/uploads/${req.file.filename}`);
    }

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id).populate(
      'seller',
      'fullName email phone enrollmentId profilePhoto'
    );

    return res.status(200).json({
      success: true,
      message: 'Product listing updated successfully.',
      product: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product listing
 * @route   DELETE /api/products/:id
 * @access  Private (Owner only)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Security check: restrict user to deleting only their own products
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are only authorized to delete your own listings.',
      });
    }

    await Product.deleteOne({ _id: product._id });

    return res.status(200).json({
      success: true,
      message: 'Product listing deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's products
 * @route   GET /api/products/my-listings
 * @access  Private
 */
const getMyListings = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings,
};

