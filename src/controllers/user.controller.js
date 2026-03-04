const User = require('../models/User');
const messages = require('../constants/messages');
const fs = require('fs');
const path = require('path');

// 🔥 Safe file delete
const deleteOldFile = (filePath) => {
  try {
    if (!filePath) return;

    const fullPath = path.join(
      __dirname,
      '../../uploads',
      filePath.replace(/^\/+/, '')
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('File delete error:', error);
  }
};

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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.auth.userNotFound,
      });
    }

    // 🧠 Role update
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
    if (req.files?.profileImage?.[0]) {
      if (user.profileImage) {
        deleteOldFile(user.profileImage);
      }

      user.profileImage =
        'providers/profile/' + req.files.profileImage[0].filename;
    }

    // 🛠 Provider validation
    if (user.role === 'provider' || user.role === 'both') {
      if (!category || !experience || !about) {
        return res.status(400).json({
          success: false,
          message: messages.provider.detailsRequired,
        });
      }

      const exp = Number(experience);

      if (isNaN(exp) || exp < 0 || exp > 50) {
        return res.status(400).json({
          success: false,
          message: messages.provider.invalidExperience,
        });
      }

      user.category = category;
      user.experience = exp;
      user.about = about;

      // 🪪 Aadhaar Front
      if (req.files?.aadharFrontImage?.[0]) {
        if (user.aadharFrontImage) {
          deleteOldFile(user.aadharFrontImage);
        }

        user.aadharFrontImage =
          'providers/aadhar/' + req.files.aadharFrontImage[0].filename;
      } else if (!user.aadharFrontImage) {
        return res.status(400).json({
          success: false,
          message: messages.provider.aadharFrontRequired,
        });
      }

      // 🪪 Aadhaar Back
      if (req.files?.aadharBackImage?.[0]) {
        if (user.aadharBackImage) {
          deleteOldFile(user.aadharBackImage);
        }

        user.aadharBackImage =
          'providers/aadhar/' + req.files.aadharBackImage[0].filename;
      } else if (!user.aadharBackImage) {
        return res.status(400).json({
          success: false,
          message: messages.provider.aadharBackRequired,
        });
      }
    }

    // 🔥 User completion
    const isUserComplete =
      user.name &&
      user.village &&
      user.tehsil &&
      user.city &&
      user.state &&
      user.pincode;

    user.isUserProfileComplete = !!isUserComplete;

    // 🛠 Provider completion
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

    // 🎯 Unified completion flag
    if (user.role === 'customer') {
      user.profileDone = user.isUserProfileComplete;
    } else {
      user.profileDone = user.isProviderProfileComplete;
    }

    await user.save();

    return res.json({
      success: true,
      message: messages.user.profileUpdated,
      data: user,
    });

  } catch (error) {
    console.error('Update Profile Error:', error);

    return res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: messages.auth.mobileRequired,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.auth.userNotFound,
      });
    }

    if (user.mobile !== mobile) {
      return res.status(400).json({
        success: false,
        message: messages.user.mobileMismatch,
      });
    }

    // 🔥 Delete images
    if (user.profileImage) deleteOldFile(user.profileImage);
    if (user.aadharFrontImage) deleteOldFile(user.aadharFrontImage);
    if (user.aadharBackImage) deleteOldFile(user.aadharBackImage);

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: messages.user.accountDeleted,
    });

  } catch (error) {
    console.error('Delete Account Error:', error);

    return res.status(500).json({
      success: false,
      message: messages.user.deleteFailed,
    });
  }
};