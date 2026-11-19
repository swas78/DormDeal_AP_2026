const mongoose = require('mongoose');

const productCategories = [
  'Electronics',
  'Books & Study Material',
  'Furniture',
  'Fashion',
  'Sports Equipment',
  'Cycles',
  'Hostel Essentials',
  'Other Items',
];

const productConditions = ['New', 'Like New', 'Good', 'Used'];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: productCategories,
        message: '{VALUE} is not a valid category',
      },
    },
    condition: {
      type: String,
      required: [true, 'Product condition is required'],
      enum: {
        values: productConditions,
        message: '{VALUE} is not a valid condition',
      },
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to a seller'],
    },
    status: {
      type: String,
      enum: ['Available', 'Sold'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and filtering
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

