const Item = require('../models/Item');

/**
 * @desc    Get all campus items with filters (Type, Category, Condition, Price, Hostel, Search)
 * @route   GET /api/items (or /api/products)
 * @access  Public
 */
const getItems = async (req, res, next) => {
  try {
    const {
      search,
      category,
      condition,
      type,
      listingType,
      minPrice,
      maxPrice,
      hostel,
      seller,
      status = 'AVAILABLE',
      sort,
      page = 1,
      limit = 24,
    } = req.query;

    const query = {};

    // Availability status
    if (status && status !== 'ALL' && status !== 'all') {
      query.status = status;
    }

    // Direct sell vs rental filter
    const selectedType = type || listingType;
    if (selectedType && selectedType !== 'ALL' && selectedType !== 'all') {
      query.listingType = selectedType.toUpperCase();
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    // Condition filter
    if (condition && condition !== 'All' && condition !== 'all') {
      query.itemCondition = condition;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) query.price.$lte = Number(maxPrice);
    }

    // Seller ID filter
    if (seller) {
      query.seller = seller;
    }

    // Keyword search across title and description
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // newest first default
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    // Fetch items with populated seller info
    let items = await Item.find(query)
      .populate(
        'seller',
        'fullName email phone enrollmentId hostelName roomNumber academicYear profilePhoto avgRating ratingCount'
      )
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Optional hostel block filtering
    if (hostel && hostel !== 'All') {
      items = items.filter(
        (item) => item.seller && item.seller.hostelName && item.seller.hostelName.toLowerCase() === hostel.toLowerCase()
      );
    }

    const total = await Item.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      items,
      products: items, // Alias for backward compatibility with frontend
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single item details by ID
 * @route   GET /api/items/:id (or /api/products/:id)
 * @access  Public
 */
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'seller',
      'fullName email phone enrollmentId hostelName roomNumber academicYear profilePhoto avgRating ratingCount'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item listing not found.',
      });
    }

    return res.status(200).json({
      success: true,
      item,
      product: item, // Alias for backward compatibility
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new listing (Sell or Rent)
 * @route   POST /api/items (or /api/products)
 * @access  Private (Requires login & accepted disclaimer)
 */
const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      listingType = 'SELL',
      category,
      itemCondition,
      condition, // alias
      price,
      originalPrice,
      rentalPeriod,
      securityDeposit,
      listingDurationDays = 14,
      openToBargaining,
      hasDefects,
      defectDetails,
    } = req.body;

    const finalCondition = itemCondition || condition;

    if (!title || !description || price === undefined || !category || !finalCondition) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, price, category, and condition are all required.',
      });
    }

    const hasDefectsBool = hasDefects === true || hasDefects === 'true';

    // Enforce transparency: if hasDefects is true, defectDetails is required
    if (hasDefectsBool && (!defectDetails || !defectDetails.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide defect details since the item was marked as having defects.',
      });
    }

    // Process uploaded images
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

    const durationDays = Number(listingDurationDays) || 14;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    const newItem = await Item.create({
      title: title.trim(),
      description: description.trim(),
      listingType: listingType.toUpperCase() === 'RENT' ? 'RENT' : 'SELL',
      category,
      itemCondition: finalCondition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      rentalPeriod: rentalPeriod || 'day',
      securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
      listingDurationDays: durationDays,
      openToBargaining: openToBargaining === true || openToBargaining === 'true',
      hasDefects: hasDefectsBool,
      defectDetails: hasDefectsBool ? defectDetails.trim() : '',
      images,
      seller: req.user._id,
      status: 'AVAILABLE',
      expiresAt,
    });

    const populated = await Item.findById(newItem._id).populate(
      'seller',
      'fullName email phone enrollmentId hostelName roomNumber academicYear profilePhoto avgRating ratingCount'
    );

    return res.status(201).json({
      success: true,
      message: 'Item published successfully to the campus community!',
      item: populated,
      product: populated, // Alias
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update listing details (Owner only)
 * @route   PUT /api/items/:id
 * @access  Private (Owner only)
 */
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only edit your own listings.',
      });
    }

    const {
      title,
      description,
      category,
      itemCondition,
      condition,
      price,
      originalPrice,
      rentalPeriod,
      securityDeposit,
      openToBargaining,
      hasDefects,
      defectDetails,
      status,
    } = req.body;

    if (title) item.title = title.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category;
    if (itemCondition || condition) item.itemCondition = itemCondition || condition;
    if (price !== undefined) item.price = Number(price);
    if (originalPrice !== undefined) item.originalPrice = Number(originalPrice);
    if (rentalPeriod) item.rentalPeriod = rentalPeriod;
    if (securityDeposit !== undefined) item.securityDeposit = Number(securityDeposit);
    if (openToBargaining !== undefined) item.openToBargaining = openToBargaining === true || openToBargaining === 'true';
    if (hasDefects !== undefined) item.hasDefects = hasDefects === true || hasDefects === 'true';
    if (defectDetails !== undefined) item.defectDetails = defectDetails.trim();
    if (status) item.status = status;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      item.images = [...item.images, ...newImages];
    } else if (req.file) {
      item.images.push(`/uploads/${req.file.filename}`);
    }

    const updated = await item.save();
    const populated = await Item.findById(updated._id).populate(
      'seller',
      'fullName email phone enrollmentId hostelName roomNumber academicYear profilePhoto'
    );

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      item: populated,
      product: populated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    One-click status change ("Mark as Sold" / "Mark as Rented")
 * @route   PUT /api/items/:id/status
 * @access  Private (Owner only)
 */
const updateItemStatus = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only update status of your own listings.',
      });
    }

    const { status } = req.body;
    if (!status || !['AVAILABLE', 'RESERVED', 'RENTED', 'SOLD', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    item.status = status;
    await item.save();

    return res.status(200).json({
      success: true,
      message: `Item status marked as ${status}.`,
      item,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Renew listing for another 14 days
 * @route   PUT /api/items/:id/renew
 * @access  Private (Owner only)
 */
const renewItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only renew your own listings.',
      });
    }

    item.expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    item.status = 'AVAILABLE';
    await item.save();

    return res.status(200).json({
      success: true,
      message: 'Listing renewed for another 14 days.',
      item,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete an item listing
 * @route   DELETE /api/items/:id (or /api/products/:id)
 * @access  Private (Owner only)
 */
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only delete your own listings.',
      });
    }

    await Item.deleteOne({ _id: item._id });

    return res.status(200).json({
      success: true,
      message: 'Listing removed successfully from campus marketplace.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current student's own listings
 * @route   GET /api/items/user/my-listings
 * @access  Private
 */
const getMyListings = async (req, res, next) => {
  try {
    const items = await Item.find({ seller: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
      products: items, // Alias
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  renewItem,
  deleteItem,
  getMyListings,
};
