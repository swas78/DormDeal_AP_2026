const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const { generate6DigitOTP, deliverOTP } = require('../utils/generateOTP');

/**
 * @desc    Send 6-digit OTP code
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOTP = async (req, res, next) => {
  try {
    const { identifier, purpose = 'registration' } = req.body;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid email or phone number is required.',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Check if account already exists when purpose is registration
    if (purpose === 'registration') {
      const existing = await User.findOne({
        $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }],
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email or phone is already registered.',
        });
      }
    }

    // Invalidate stale unverified OTPs for this identifier
    await OTP.deleteMany({ identifier: cleanIdentifier, purpose });

    const code = generate6DigitOTP();
    await OTP.create({
      identifier: cleanIdentifier,
      otp: code,
      purpose,
      verified: false,
    });

    const delivery = await deliverOTP(cleanIdentifier, code, purpose);

    const payload = {
      success: true,
      message: `Verification OTP dispatched to ${cleanIdentifier}. Valid for 5 minutes.`,
    };

    if ((delivery.isDemoMode || cleanIdentifier.includes('test')) && process.env.NODE_ENV !== 'production') {
      payload.demoOtp = code;
    }

    return res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify 6-digit OTP code
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { identifier, otp, purpose = 'registration' } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Both identifier and OTP code are required.',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const record = await OTP.findOne({
      identifier: cleanIdentifier,
      otp: cleanOtp,
      purpose,
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please request a new one.',
      });
    }

    record.verified = true;
    await record.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Register a new university student
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const {
      fullName,
      enrollmentId,
      email,
      phone,
      password,
      confirmPassword,
      hostelName,
      roomNumber,
      academicYear,
      termsAccepted,
      otp,
    } = req.body;

    if (!fullName || !enrollmentId || !email || !phone || !password || !hostelName || !roomNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Enrollment ID, Email, Phone, Password, Hostel, Room).',
      });
    }

    if (termsAccepted !== true && termsAccepted !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the DormDeal campus guidelines and terms.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanEnrollment = enrollmentId.trim().toUpperCase();
    const cleanPhone = phone.trim();

    // Check duplicate accounts
    const dupEnroll = await User.findOne({ enrollmentId: cleanEnrollment });
    if (dupEnroll) {
      return res.status(400).json({
        success: false,
        message: `University Enrollment ID "${cleanEnrollment}" is already registered.`,
      });
    }

    const dupEmail = await User.findOne({ email: cleanEmail });
    if (dupEmail) {
      return res.status(400).json({
        success: false,
        message: `Email "${cleanEmail}" is already registered.`,
      });
    }

    const dupPhone = await User.findOne({ phone: cleanPhone });
    if (dupPhone) {
      return res.status(400).json({
        success: false,
        message: `Phone number "${cleanPhone}" is already registered.`,
      });
    }

    // Check verified OTP if provided
    let isVerified = false;
    if (otp) {
      const otpRec = await OTP.findOne({
        identifier: { $in: [cleanEmail, cleanPhone] },
        otp: otp.toString().trim(),
        verified: true,
      });
      if (otpRec) isVerified = true;
    }

    let profilePhotoUrl = '';
    if (req.file) {
      profilePhotoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.profilePhoto) {
      profilePhotoUrl = req.body.profilePhoto;
    }

    const newUser = await User.create({
      fullName: fullName.trim(),
      enrollmentId: cleanEnrollment,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      hostelName: hostelName.trim(),
      roomNumber: roomNumber.trim(),
      academicYear: academicYear ? academicYear.trim() : '1st Year',
      profilePhoto: profilePhotoUrl,
      isEmailVerified: isVerified,
      isPhoneVerified: isVerified,
      disclaimerAccepted: false,
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully!',
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        enrollmentId: newUser.enrollmentId,
        email: newUser.email,
        phone: newUser.phone,
        hostelName: newUser.hostelName,
        roomNumber: newUser.roomNumber,
        academicYear: newUser.academicYear,
        profilePhoto: newUser.profilePhoto,
        avgRating: newUser.avgRating,
        ratingCount: newUser.ratingCount,
        disclaimerAccepted: newUser.disclaimerAccepted,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Authenticate student & get token (supports Email OR Phone)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your Email/Phone and Password.',
      });
    }

    const cleanId = loginIdentifier.trim().toLowerCase();

    // Match by email OR phone
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: loginIdentifier.trim() }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No student account found with this email or phone.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Welcome back to DormDeal!',
      token,
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
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Logout student session
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully from DormDeal session.',
  });
};

/**
 * @desc    Reset password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { identifier, otp, newPassword, confirmPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Identifier, OTP code, and new password are required.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    const cleanId = identifier.trim().toLowerCase();

    const otpRec = await OTP.findOne({
      identifier: cleanId,
      otp: otp.toString().trim(),
    });

    if (!otpRec) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code.',
      });
    }

    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: identifier.trim() }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    user.password = newPassword;
    await user.save();
    await OTP.deleteMany({ identifier: cleanId });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
};
