const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware: Verifies JWT Bearer token and attaches authenticated user
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'dormdeal_campus_jwt_secret_key_2026';
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Student account belonging to this token no longer exists.',
        });
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Token is invalid or expired.',
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Not authorized. No Bearer token provided.',
  });
};

/**
 * Enforce campus safety disclaimer acceptance
 */
const requireDisclaimer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (!req.user.disclaimerAccepted) {
    return res.status(403).json({
      success: false,
      requiresDisclaimer: true,
      message: 'Please review and accept the campus guidelines and disclaimer first.',
    });
  }

  next();
};

module.exports = {
  protect,
  requireDisclaimer,
};
