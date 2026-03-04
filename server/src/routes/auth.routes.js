const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const messages = require('../constants/messages');

const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth.middleware');

// 🔐 OTP Rate Limiter
const otpLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: messages.auth.tooManyOtp,
  },
});

// Public Routes
router.post('/send-otp', otpLimiter, authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

// Protected
router.use(authMiddleware);

router.post('/role', authController.saveRole);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;