const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dealType: {
      type: String,
      enum: ['SELL', 'RENT'],
      required: true,
    },
    agreedPrice: {
      type: Number,
      required: true,
      min: [0, 'Agreed price cannot be negative'],
    },
    securityDepositPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    rentalStartDate: {
      type: Date,
      default: null,
    },
    rentalEndDate: {
      type: Date,
      default: null,
    },
    dealStatus: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'ACTIVE', 'RETURNED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

dealSchema.index({ buyer: 1, seller: 1, dealStatus: 1 });
dealSchema.index({ item: 1 });

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
