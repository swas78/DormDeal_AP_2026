const mongoose = require('mongoose');

const CATEGORIES = [
  'Clothing',
  'Electronics',
  'Notes',
  'Printouts',
  'Groceries',
  'Stationery',
  'Hostel Decor',
  'Utensils',
  'Skincare',
  'Haircare',
  'Sports Items',
];

const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair'];

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    listingType: {
      type: String,
      enum: ['SELL', 'RENT'],
      default: 'SELL',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid campus category',
      },
    },
    itemCondition: {
      type: String,
      required: [true, 'Item condition is required'],
      enum: {
        values: CONDITIONS,
        message: '{VALUE} is not a valid condition',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: null,
      min: [0, 'Original MRP must be positive'],
    },
    rentalPeriod: {
      type: String,
      enum: ['hour', 'day', 'week', 'month'],
      default: 'day',
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit must be positive'],
    },
    listingDurationDays: {
      type: Number,
      enum: [2, 7, 14, 30],
      default: 14,
    },
    openToBargaining: {
      type: Boolean,
      default: false,
    },
    hasDefects: {
      type: Boolean,
      default: false,
    },
    defectDetails: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Item must belong to a seller'],
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'RENTED', 'SOLD', 'ARCHIVED'],
      default: 'AVAILABLE',
    },
    // Auto-expires 14 days after creation by default
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search and filtering indexes
itemSchema.index({ title: 'text', description: 'text' });
itemSchema.index({ category: 1, listingType: 1, status: 1, price: 1 });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
module.exports.CATEGORIES = CATEGORIES;
module.exports.CONDITIONS = CONDITIONS;
