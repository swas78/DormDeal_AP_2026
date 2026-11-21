const BroadcastRequest = require('../models/BroadcastRequest');
const Notification = require('../models/Notification');

/**
 * @desc    Get all active campus broadcast requests
 * @route   GET /api/broadcasts
 * @access  Public
 */
const getBroadcasts = async (req, res, next) => {
  try {
    const { category, status } = req.query;

    const query = {};
    if (!status || status === 'active' || status === 'OPEN') {
      query.status = { $in: ['OPEN', 'MATCHED'] };
    } else if (status === 'MATCHED') {
      query.status = 'MATCHED';
    } else if (status !== 'ALL') {
      query.status = status;
    }

    if (category && category !== 'All') query.category = category;

    const broadcasts = await BroadcastRequest.find(query)
      .populate('buyer', 'fullName enrollmentId hostelName roomNumber academicYear profilePhoto phone email')
      .populate('matchedBy', 'fullName hostelName roomNumber phone email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: broadcasts.length,
      broadcasts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Post a new campus broadcast request (Auto-deletes in 3 days)
 * @route   POST /api/broadcasts
 * @access  Private (Requires login & disclaimer)
 */
const createBroadcast = async (req, res, next) => {
  try {
    const { title, category, maxBudget, neededByDate, notes } = req.body;

    if (!title || !category || maxBudget === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item title, category, and maximum budget are required.',
      });
    }

    const broadcast = await BroadcastRequest.create({
      title: title.trim(),
      category,
      maxBudget: Number(maxBudget),
      neededByDate: neededByDate ? neededByDate.trim() : 'Today',
      notes: notes ? notes.trim() : '',
      buyer: req.user._id,
      status: 'OPEN',
    });

    const populated = await BroadcastRequest.findById(broadcast._id).populate(
      'buyer',
      'fullName enrollmentId hostelName roomNumber academicYear profilePhoto'
    );

    return res.status(201).json({
      success: true,
      message: 'Your request has been broadcasted to the campus community! Valid for 3 days.',
      broadcast: populated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Fulfill / Match a broadcast request ("I Have This")
 * @route   POST /api/broadcasts/:id/match
 * @access  Private
 */
const matchBroadcast = async (req, res, next) => {
  try {
    const broadcast = await BroadcastRequest.findById(req.params.id).populate('buyer', 'fullName email phone');

    if (!broadcast) {
      return res.status(404).json({
        success: false,
        message: 'Broadcast request not found or has expired.',
      });
    }

    if (broadcast.buyer._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot fulfill your own broadcast request.',
      });
    }

    if (broadcast.status === 'MATCHED') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been matched by another student.',
      });
    }

    broadcast.status = 'MATCHED';
    broadcast.matchedBy = req.user._id;
    broadcast.matchedAt = new Date();
    await broadcast.save();

    // Create an in-app notification for the buyer
    await Notification.create({
      recipient: broadcast.buyer._id,
      sender: req.user._id,
      title: 'Item Found for your Request!',
      message: `${req.user.fullName} from ${req.user.hostelName} (${req.user.roomNumber}) has the item you requested: "${broadcast.title}". Phone: ${req.user.phone}`,
      type: 'BROADCAST_MATCH',
      link: `/broadcasts`,
    });

    return res.status(200).json({
      success: true,
      message: `Match confirmed! ${broadcast.buyer.fullName} has been notified with your hostel and contact details.`,
      broadcast,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current user's broadcast requests
 * @route   GET /api/broadcasts/my-broadcasts
 * @access  Private
 */
const getMyBroadcasts = async (req, res, next) => {
  try {
    const broadcasts = await BroadcastRequest.find({ buyer: req.user._id })
      .populate('matchedBy', 'fullName phone email hostelName roomNumber')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: broadcasts.length,
      broadcasts,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a broadcast request
 * @route   DELETE /api/broadcasts/:id
 * @access  Private (Owner only)
 */
const deleteBroadcast = async (req, res, next) => {
  try {
    const broadcast = await BroadcastRequest.findById(req.params.id);

    if (!broadcast) {
      return res.status(404).json({
        success: false,
        message: 'Broadcast request not found.',
      });
    }

    if (broadcast.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only delete your own requests.',
      });
    }

    await BroadcastRequest.deleteOne({ _id: broadcast._id });

    return res.status(200).json({
      success: true,
      message: 'Broadcast request removed.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBroadcasts,
  createBroadcast,
  matchBroadcast,
  getMyBroadcasts,
  deleteBroadcast,
};
