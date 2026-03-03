const express = require('express');
const router = express.Router();
const { createSupportTicket } = require('../controllers/supportController');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/ticket', authMiddleware, createSupportTicket);

module.exports = router;