const User = require('../models/User');
const Review = require('../models/Review');

/**
 * @desc    Get current authenticated student profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update student profile details
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    if (req.body.fullName) user.fullName = req.body.fullName.trim();
    if (req.body.hostelName) user.hostelName = req.body.hostelName.trim();
    if (req.body.roomNumber) user.roomNumber = req.body.roomNumber.trim();
    if (req.body.academicYear) user.academicYear = req.body.academicYear.trim();

    if (req.body.phone && req.body.phone.trim() !== user.phone) {
      const existing = await User.findOne({
        phone: req.body.phone.trim(),
        _id: { $ne: user._id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'This phone number is already registered to another student.',
        });
      }
      user.phone = req.body.phone.trim();
    }

    if (req.file) {
      user.profilePhoto = `/uploads/${req.file.filename}`;
    }

    const updated = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: updated._id,
        fullName: updated.fullName,
        enrollmentId: updated.enrollmentId,
        email: updated.email,
        phone: updated.phone,
        hostelName: updated.hostelName,
        roomNumber: updated.roomNumber,
        academicYear: updated.academicYear,
        profilePhoto: updated.profilePhoto,
        avgRating: updated.avgRating,
        ratingCount: updated.ratingCount,
        disclaimerAccepted: updated.disclaimerAccepted,
        createdAt: updated.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Accept mandatory campus safety disclaimer
 * @route   PUT /api/users/accept-disclaimer
 * @access  Private
 */
const acceptDisclaimer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    user.disclaimerAccepted = true;
    user.disclaimerAcceptedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Campus guidelines accepted. Welcome to DormDeal!',
      user: {
        _id: user._id,
        fullName: user.fullName,
        enrollmentId: user.enrollmentId,
        email: user.email,
        phone: user.phone,
        hostelName: user.hostelName,
        roomNumber: user.roomNumber,
        academicYear: user.academicYear,
        profilePhoto: user.profilePhoto,
        avgRating: user.avgRating,
        ratingCount: user.ratingCount,
        disclaimerAccepted: user.disclaimerAccepted,
        disclaimerAcceptedAt: user.disclaimerAcceptedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get public student reputation & verified reviews
 * @route   GET /api/users/:id/reputation
 * @access  Public
 */
const getUserReputation = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id).select(
      'fullName enrollmentId hostelName roomNumber academicYear profilePhoto avgRating ratingCount createdAt'
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const reviews = await Review.find({ reviewee: student._id })
      .populate('reviewer', 'fullName hostelName profilePhoto')
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      student,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateProfile,
  acceptDisclaimer,
  getUserReputation,
};
