const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // 🔐 Auth (created only once during OTP login)
    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ['customer', 'provider', 'both'],
      default: null,
    },

    // 🧍 Basic User Info
    profileImage: { type: String, default: null },
    name: { type: String, default: '' },
    village: { type: String, default: '' },
    tehsil: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },

    // 🛠 Provider Extra Fields (required if role = provider/both)
    category: { type: String, default: '' },
    experience: { type: Number, default: 0 },
    about: { type: String, default: '' },

    // 🪪 Aadhaar Verification (MANDATORY for provider/both)
    aadharFrontImage: { type: String, default: '' },
    aadharBackImage: { type: String, default: '' },
    isAadharVerified: { type: Boolean, default: false },

    // ⭐ Auto managed fields
    rating: { type: Number, default: 0 },
    servicesDone: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },

    // 📌 Existing Flow Flags (keep same)
    profileDone: {
      type: Boolean,
      default: false,
    },

    paymentDone: {
      type: Boolean,
      default: false,
    },

    // 🔥 Granular completion flags (new)
    isUserProfileComplete: { type: Boolean, default: false },
    isProviderProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);