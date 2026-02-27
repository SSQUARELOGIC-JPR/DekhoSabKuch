const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth.middleware');

// Public
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

// Protected
router.post('/save-role', authMiddleware, authController.saveRole);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;