const SupportTicket = require('../models/SupportTicket');
const messages = require('../constants/messages');

exports.createSupportTicket = async (req, res) => {
  try {
    const userId = req.userId;

    const { type, summary, description } = req.body || {};

    // 🔍 Validation
    if (!type || !summary || !description) {
      return res.status(400).json({
        success: false,
        message: messages.support.fieldsRequired,
      });
    }

    const ticket = await SupportTicket.create({
      user: userId,
      type,
      summary,
      description,
    });

    return res.status(201).json({
      success: true,
      message: messages.support.created,
      data: ticket,
    });

  } catch (error) {
    console.error('Support Ticket Error:', error);

    return res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};