const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
    profileDone: {
      type: Boolean,
      default: false,
    },
    paymentDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);