const Notification = require('../models/Notification');
const messages = require('../constants/messages');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notifications,
    });

  } catch (error) {
    console.error('Notification Error:', error);

    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    res.json({
      success: true,
      count,
    });

  } catch (error) {
    console.error('Unread Count Error:', error);

    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      isRead: true,
    });

    res.json({
      success: true,
    });

  } catch (error) {
    console.error('Mark Read Error:', error);

    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};