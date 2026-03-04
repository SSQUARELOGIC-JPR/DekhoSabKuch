const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { paymentSuccess } = require('../controllers/payment.controller');

router.post('/success', authMiddleware, paymentSuccess);

module.exports = router;