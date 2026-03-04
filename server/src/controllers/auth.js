const User = require('../models/User');
const jwt = require('jsonwebtoken');
const messages = require('../constants/messages');
const createNotification = require('../../utills/createNotification');

// In-memory OTP store (dev only)
const otpStore = new Map();

// 📲 Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    // 🔎 Validation
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: messages.auth.mobileRequired,
      });
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: messages.auth.invalidMobile,
      });
    }

    // 🔐 Generate OTP (dev mode static)
    const otp = '1234';

    // ⏳ Store OTP with expiry (5 minutes)
    otpStore.set(mobile, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log(`📲 OTP for ${mobile}: ${otp}`);

    res.json({
      success: true,
      message: messages.auth.otpSent,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
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

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: messages.auth.invalidMobile,
      });
    }

    const storedData = otpStore.get(mobile);

    // ❌ OTP not found or expired
    if (!storedData || storedData.expiresAt < Date.now()) {
      otpStore.delete(mobile);
      return res.status(400).json({
        success: false,
        message: messages.auth.invalidOtp,
      });
    }

    // ❌ Wrong OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: messages.auth.invalidOtp,
      });
    }

    // ✅ OTP correct → remove it
    otpStore.delete(mobile);

    // 🔍 Check if user exists
    let user = await User.findOne({ mobile });
    let isNewUser = false;

    // 👤 Create user if not exists
    if (!user) {
      user = await User.create({ mobile });
      isNewUser = true;
    }

    // 🔐 Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET missing in environment');
    }

    // 🔐 Generate Token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    if (isNewUser) {
      await createNotification({
        user: user._id,
        title: messages.notification.welcomeTitle,
        message: messages.notification.welcomeMessage,
        type: "login",
      });
    }
    res.json({
      success: true,
      message: messages.auth.loginSuccess,
      token,
      user,
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
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

    const allowedRoles = ['customer', 'provider', 'both'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: messages.auth.invalidRole,
      });
    }

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
    console.error('Save Role Error:', error);
    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

// 🙋 Get Logged-in User
exports.getMe = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;

    const data = {
      _id: user._id,
      mobile: user.mobile,
      role: user.role,

      // 🧍 Basic Info
      name: user.name,
      village: user.village,
      tehsil: user.tehsil,
      city: user.city,
      state: user.state,
      pincode: user.pincode,

      // 🛠 Provider Info
      category: user.category,
      experience: user.experience,
      about: user.about,
      rating: user.rating,
      servicesDone: user.servicesDone,
      isAvailable: user.isAvailable,

      // 📸 Images
      profileImage: user.profileImage
        ? `${baseUrl}/${user.profileImage}`
        : '',

      aadharFrontImage:
        user.role === 'provider' || user.role === 'both'
          ? user.aadharFrontImage
            ? `${baseUrl}/${user.aadharFrontImage}`
            : ''
          : '',

      aadharBackImage:
        user.role === 'provider' || user.role === 'both'
          ? user.aadharBackImage
            ? `${baseUrl}/${user.aadharBackImage}`
            : ''
          : '',

      // 🔥 Flow Flags
      profileDone: user.profileDone,
      paymentDone: user.paymentDone,
      isUserProfileComplete: user.isUserProfileComplete,
      isProviderProfileComplete: user.isProviderProfileComplete,
    };

    res.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

// 🚪 Logout
exports.logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};