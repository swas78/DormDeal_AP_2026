const Review = require('../models/Review');
const Deal = require('../models/Deal');
const User = require('../models/User');

/**
 * @desc    Submit peer review after deal completion
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res, next) => {
  try {
    const { dealId, rating, comment } = req.body;

    if (!dealId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Deal ID and numerical rating (1-5) are required.',
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found.',
      });
    }

    // Only allow reviews on COMPLETED deals
    if (deal.dealStatus !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted after a deal is marked as COMPLETED.',
      });
    }

    const isBuyer = deal.buyer.toString() === req.user._id.toString();
    const isSeller = deal.seller.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not a participant in this deal.',
      });
    }

    // Reviewee is the counterparty
    const revieweeId = isBuyer ? deal.seller : deal.buyer;

    // Check if review already exists for this deal (Strictly 1 review per deal)
    const existing = await Review.findOne({ deal: deal._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A review has already been submitted for this deal.',
      });
    }

    const review = await Review.create({
      deal: deal._id,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating: numRating,
      comment: comment ? comment.trim() : '',
    });

    // Recompute reviewee's average rating dynamically
    const allReviews = await Review.find({ reviewee: revieweeId });
    const count = allReviews.length;
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / count;

    await User.findByIdAndUpdate(revieweeId, {
      avgRating: Number(avg.toFixed(2)),
      ratingCount: count,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for building campus trust!',
      review,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get reviews for a given student
 * @route   GET /api/reviews/user/:userId
 * @access  Public
 */
const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'fullName hostelName profilePhoto')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getUserReviews,
};
