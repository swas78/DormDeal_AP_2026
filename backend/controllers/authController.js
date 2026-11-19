const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const { generate6DigitOTP, deliverOTP } = require('../utils/generateOTP');

/**
 * @desc    Send OTP to university email or phone
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOTP = async (req, res, next) => {
  try {
    const { identifier, purpose = 'registration' } = req.body;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid email or phone number is required to send an OTP.',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Check if purpose is registration and user already exists
    if (purpose === 'registration') {
      const existingUser = await User.findOne({
        $or: [{ email: cleanIdentifier }, { phone: cleanIdentifier }],
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email or phone is already registered.',
        });
      }
    }

    // Invalidate any existing unverified OTPs for this identifier & purpose
    await OTP.deleteMany({ identifier: cleanIdentifier, purpose });

    // Generate new 6-digit OTP
    const otpCode = generate6DigitOTP();

    // Save in DB with 5-minute TTL
    await OTP.create({
      identifier: cleanIdentifier,
      otp: otpCode,
      purpose,
      verified: false,
    });

    // Deliver OTP (or simulate in development/demo mode)
    const delivery = await deliverOTP(cleanIdentifier, otpCode, purpose);

    const responsePayload = {
      success: true,
      message: `Verification OTP dispatched to ${cleanIdentifier}. Valid for 5 minutes.`,
      isDemoMode: delivery.isDemoMode,
    };

    // Include demo OTP in development/demo mode so testers don't need real SMS/email credentials
    if (delivery.isDemoMode && process.env.NODE_ENV !== 'production') {
      responsePayload.demoOtp = otpCode;
      responsePayload.demoHint = 'For demo/evaluation purposes, use this code to verify.';
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP code
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

    // Mark verified
    record.verified = true;
    await record.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verification successful! You can now proceed.',
    });
  } catch (error) {
    next(error);
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
      termsAccepted,
      otp,
    } = req.body;

    // Validate required fields
    if (!fullName || !enrollmentId || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required registration fields.',
      });
    }

    if (termsAccepted !== true && termsAccepted !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the Terms and Conditions to register.',
      });
    }

    // Validate password match
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match. Please re-enter identical passwords.',
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

    // Check uniqueness
    const userWithEnrollment = await User.findOne({ enrollmentId: cleanEnrollment });
    if (userWithEnrollment) {
      return res.status(400).json({
        success: false,
        message: `University Enrollment ID "${cleanEnrollment}" is already registered.`,
      });
    }

    const userWithEmail = await User.findOne({ email: cleanEmail });
    if (userWithEmail) {
      return res.status(400).json({
        success: false,
        message: `Email "${cleanEmail}" is already registered. Please login instead.`,
      });
    }

    const userWithPhone = await User.findOne({ phone: cleanPhone });
    if (userWithPhone) {
      return res.status(400).json({
        success: false,
        message: `Phone number "${cleanPhone}" is already registered.`,
      });
    }

    // Check OTP verification
    let isPhoneOrEmailVerified = false;
    if (otp) {
      const otpRecord = await OTP.findOne({
        identifier: { $in: [cleanEmail, cleanPhone] },
        otp: otp.toString().trim(),
        verified: true,
      });
      if (otpRecord) {
        isPhoneOrEmailVerified = true;
      }
    }

    // Handle profile photo from upload or default
    let profilePhotoUrl = '';
    if (req.file) {
      profilePhotoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.profilePhoto) {
      profilePhotoUrl = req.body.profilePhoto;
    }

    // Create user
    const newUser = await User.create({
      fullName: fullName.trim(),
      enrollmentId: cleanEnrollment,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      profilePhoto: profilePhotoUrl,
      isEmailVerified: isPhoneOrEmailVerified,
      isPhoneVerified: isPhoneOrEmailVerified,
      disclaimerAccepted: false, // Must be accepted on Page 3
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: 'Student registration completed successfully!',
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        enrollmentId: newUser.enrollmentId,
        email: newUser.email,
        phone: newUser.phone,
        profilePhoto: newUser.profilePhoto,
        isEmailVerified: newUser.isEmailVerified,
        isPhoneVerified: newUser.isPhoneVerified,
        disclaimerAccepted: newUser.disclaimerAccepted,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
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

    const cleanIdentifier = loginIdentifier.trim().toLowerCase();

    // Look for user by email OR phone
    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { phone: loginIdentifier.trim() }],
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
      message: 'Welcome back to CampusKart!',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        enrollmentId: user.enrollmentId,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        disclaimerAccepted: user.disclaimerAccepted,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (token-based invalidation/acknowledgement)
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully from CampusKart session.',
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

    const cleanIdentifier = identifier.trim().toLowerCase();

    const otpRecord = await OTP.findOne({
      identifier: cleanIdentifier,
      otp: otp.toString().trim(),
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code.',
      });
    }

    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { phone: identifier.trim() }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    user.password = newPassword;
    await user.save();
    await OTP.deleteMany({ identifier: cleanIdentifier });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
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

