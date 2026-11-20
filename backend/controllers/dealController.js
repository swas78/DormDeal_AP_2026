const Deal = require('../models/Deal');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

/**
 * @desc    Create a new handover deal / reservation
 * @route   POST /api/deals
 * @access  Private (Buyer)
 */
const createDeal = async (req, res, next) => {
  try {
    const { itemId, dealType = 'SELL', agreedPrice, securityDepositPaid = 0, rentalStartDate, rentalEndDate } = req.body;

    if (!itemId || agreedPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and agreed price are required.',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    if (item.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot initiate a deal for your own item.',
      });
    }

    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        message: `This item is currently ${item.status.toLowerCase()} and cannot be reserved.`,
      });
    }

    const deal = await Deal.create({
      item: item._id,
      buyer: req.user._id,
      seller: item.seller,
      dealType: dealType.toUpperCase() === 'RENT' ? 'RENT' : 'SELL',
      agreedPrice: Number(agreedPrice),
      securityDepositPaid: Number(securityDepositPaid) || 0,
      rentalStartDate: rentalStartDate ? new Date(rentalStartDate) : null,
      rentalEndDate: rentalEndDate ? new Date(rentalEndDate) : null,
      dealStatus: 'PENDING',
    });

    // Notify the seller
    await Notification.create({
      recipient: item.seller,
      sender: req.user._id,
      title: 'New Deal Offer Received!',
      message: `${req.user.fullName} initiated a ${deal.dealType} deal for "${item.title}" at ₹${deal.agreedPrice}.`,
      type: 'DEAL_UPDATE',
      link: '/deals',
    });

    const populated = await Deal.findById(deal._id)
      .populate('item', 'title price images category status')
      .populate('seller', 'fullName hostelName roomNumber phone')
      .populate('buyer', 'fullName hostelName roomNumber phone');

    return res.status(201).json({
      success: true,
      message: 'Deal initiated successfully! Awaiting seller acceptance.',
      deal: populated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current user's deals (as buyer or seller)
 * @route   GET /api/deals/my-deals
 * @access  Private
 */
const getMyDeals = async (req, res, next) => {
  try {
    const deals = await Deal.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate('item', 'title price images category status listingType')
      .populate('buyer', 'fullName email phone hostelName roomNumber profilePhoto')
      .populate('seller', 'fullName email phone hostelName roomNumber profilePhoto')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: deals.length,
      deals,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Advance deal state machine (accept, activate, return, complete, cancel)
 * @route   PUT /api/deals/:id/status
 * @access  Private (Parties to deal)
 */
const updateDealStatus = async (req, res, next) => {
  try {
    const { action } = req.body;
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found.',
      });
    }

    const isBuyer = deal.buyer.toString() === req.user._id.toString();
    const isSeller = deal.seller.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not a party to this deal.',
      });
    }

    const item = await Item.findById(deal.item);

    switch (action) {
      case 'accept':
        if (!isSeller) {
          return res.status(403).json({ success: false, message: 'Only the seller can accept the deal.' });
        }
        deal.dealStatus = 'ACCEPTED';
        if (item) {
          item.status = 'RESERVED';
          await item.save();
        }
        break;

      case 'activate':
        deal.dealStatus = 'ACTIVE';
        if (item) {
          item.status = deal.dealType === 'RENT' ? 'RENTED' : 'SOLD';
          await item.save();
        }
        break;

      case 'return':
        if (deal.dealType !== 'RENT') {
          return res.status(400).json({ success: false, message: 'Return action only applies to rentals.' });
        }
        deal.dealStatus = 'RETURNED';
        if (item) {
          item.status = 'AVAILABLE';
          await item.save();
        }
        break;

      case 'complete':
        deal.dealStatus = 'COMPLETED';
        if (item && deal.dealType === 'SELL') {
          item.status = 'SOLD';
          await item.save();
        }
        break;

      case 'cancel':
        deal.dealStatus = 'CANCELLED';
        if (item) {
          item.status = 'AVAILABLE';
          await item.save();
        }
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Allowed: accept, activate, return, complete, cancel.',
        });
    }

    await deal.save();

    // Notify the other party
    const recipient = isBuyer ? deal.seller : deal.buyer;
    await Notification.create({
      recipient,
      sender: req.user._id,
      title: `Deal Status: ${deal.dealStatus}`,
      message: `The deal for item was updated to "${deal.dealStatus}".`,
      type: 'DEAL_UPDATE',
      link: '/deals',
    });

    return res.status(200).json({
      success: true,
      message: `Deal status updated to ${deal.dealStatus}.`,
      deal,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createDeal,
  getMyDeals,
  updateDealStatus,
};
