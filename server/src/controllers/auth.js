const User = require('../models/User');
const jwt = require('jsonwebtoken');
const messages = require('../constants/messages');

// In-memory OTP store (dev only)
const otpStore = new Map();

// 📲 Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: messages.auth.mobileRequired,
      });
    }

    const otp = '1234'; // dummy OTP
    otpStore.set(mobile, otp);

    console.log(`OTP for ${mobile}: ${otp}`);

    res.json({
      success: true,
      message: messages.auth.otpSent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

// ✅ Verify OTP + Login
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: messages.auth.mobileRequired,
      });
    }

    const storedOtp = otpStore.get(mobile);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: messages.auth.invalidOtp,
      });
    }

    otpStore.delete(mobile);

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({ mobile });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: messages.auth.loginSuccess,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

// 👤 Save Role
exports.saveRole = async (req, res) => {
  try {
    const userId = req.userId;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    res.json({
      success: true,
      message: messages.auth.roleSaved,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};