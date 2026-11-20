const mongoose = require('mongoose');
const { CATEGORIES } = require('./Item');

const broadcastRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please specify what item you are looking for'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
    },
    maxBudget: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      min: [0, 'Budget must be positive'],
    },
    neededByDate: {
      type: String,
      default: 'Today',
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'MATCHED', 'EXPIRED'],
      default: 'OPEN',
    },
    matchedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    matchedAt: {
      type: Date,
      default: null,
    },
    // 3-Day (72 Hours) auto-expiry TTL
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 259200, // 3 days in seconds (3 * 24 * 60 * 60)
    },
  },
  {
    timestamps: true,
  }
);

broadcastRequestSchema.index({ category: 1, status: 1 });

const BroadcastRequest = mongoose.model('BroadcastRequest', broadcastRequestSchema);

module.exports = BroadcastRequest;
