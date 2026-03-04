const jwt = require('jsonwebtoken');
const messages = require('../constants/messages');

module.exports = async (req, res, next) => {
  try {
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: messages.auth.unauthorized || 'Unauthorized',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: messages.auth.unauthorized || 'Unauthorized',
      });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // userId attach for controllers
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({
      success: false,
      message: messages.auth.invalidToken || 'Invalid or expired token',
    });
  }
};