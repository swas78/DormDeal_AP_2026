const User = require('../models/User');

/**
 * @desc    Get current logged in student profile
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
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current student profile
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

    if (req.body.fullName) {
      user.fullName = req.body.fullName.trim();
    }

    if (req.body.phone && req.body.phone !== user.phone) {
      const existingPhone = await User.findOne({
        phone: req.body.phone.trim(),
        _id: { $ne: user._id },
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'This phone number is already registered to another account.',
        });
      }
      user.phone = req.body.phone.trim();
    }

    if (req.file) {
      user.profilePhoto = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        enrollmentId: updatedUser.enrollmentId,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePhoto: updatedUser.profilePhoto,
        isEmailVerified: updatedUser.isEmailVerified,
        isPhoneVerified: updatedUser.isPhoneVerified,
        disclaimerAccepted: updatedUser.disclaimerAccepted,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Acknowledge & accept campus disclaimer guidelines
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

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Campus guidelines accepted. Welcome to CampusKart!',
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        enrollmentId: updatedUser.enrollmentId,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePhoto: updatedUser.profilePhoto,
        isEmailVerified: updatedUser.isEmailVerified,
        isPhoneVerified: updatedUser.isPhoneVerified,
        disclaimerAccepted: updatedUser.disclaimerAccepted,
        disclaimerAcceptedAt: updatedUser.disclaimerAcceptedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  updateProfile,
  acceptDisclaimer,
};

