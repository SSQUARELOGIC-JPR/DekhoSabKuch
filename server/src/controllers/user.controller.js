const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      role,
      name,
      village,
      tehsil,
      city,
      state,
      pincode,
      category,
      experience,
      about,
    } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    // 🧠 Role update (if provided)
    if (role && ['customer', 'provider', 'both'].includes(role)) {
      user.role = role;
    }

    // 🧍 Basic fields
    if (name) user.name = name;
    if (village) user.village = village;
    if (tehsil) user.tehsil = tehsil;
    if (city) user.city = city;
    if (state) user.state = state;
    if (pincode) user.pincode = pincode;

    // 📸 Profile Image
    if (req.files?.profileImage) {
      user.profileImage =
        'providers/profile/' + req.files.profileImage[0].filename;
    }

    // 🚨 STRICT VALIDATION for provider/both BEFORE saving
    if (user.role === 'provider' || user.role === 'both') {
      // Basic provider fields always required
      if (!category || !experience || !about) {
        return res.status(400).json({
          success: false,
          message: 'Provider details (category, experience, about) are required',
        });
      }

      // Assign provider fields
      user.category = category;
      user.experience = experience;
      user.about = about;

      // 🪪 Aadhaar Front (update only if new uploaded)
      if (req.files?.aadharFrontImage) {
        user.aadharFrontImage =
          'providers/aadhar/' + req.files.aadharFrontImage[0].filename;
      } else if (!user.aadharFrontImage) {
        return res.status(400).json({
          success: false,
          message: 'Aadhaar front image is required',
        });
      }

      // 🪪 Aadhaar Back (update only if new uploaded)
      if (req.files?.aadharBackImage) {
        user.aadharBackImage =
          'providers/aadhar/' + req.files.aadharBackImage[0].filename;
      } else if (!user.aadharBackImage) {
        return res.status(400).json({
          success: false,
          message: 'Aadhaar back image is required',
        });
      }
    }

    // 🔥 Completion Logic
    const isUserComplete =
      user.name &&
      user.village &&
      user.tehsil &&
      user.city &&
      user.state &&
      user.pincode;

    user.isUserProfileComplete = !!isUserComplete;

    if (user.role === 'provider' || user.role === 'both') {
      const isProviderComplete =
        isUserComplete &&
        user.category &&
        user.experience > 0 &&
        user.about &&
        user.aadharFrontImage &&
        user.aadharBackImage;

      user.isProviderProfileComplete = !!isProviderComplete;
    }

    // 🎯 Unified profile completion flag for frontend flow
    if (user.role === 'customer') {
      user.profileDone = user.isUserProfileComplete;
    } else if (user.role === 'provider' || user.role === 'both') {
      user.profileDone = user.isProviderProfileComplete;
    }
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 🔐 Extra verification
    if (user.mobile !== mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number does not match',
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });

  } catch (error) {
    console.error('Delete Account Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete account',
    });
  }
};