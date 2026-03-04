const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
} = require('../controllers/notification.controller');

router.get('/', authMiddleware, getNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.put('/read/:id', authMiddleware, markAsRead);

module.exports = router;