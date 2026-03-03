const SupportTicket = require('../models/SupportTicket');

exports.createSupportTicket = async (req, res) => {
  try {
    console.log('BODY =>', req.body); // 👈 DEBUG

    const userId = req.userId;

    const { type, summary, description } = req.body || {};

    if (!type || !summary || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
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
      message: 'Support ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Support Ticket Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};