const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'dormdeal_campus_jwt_secret_key_2026';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
