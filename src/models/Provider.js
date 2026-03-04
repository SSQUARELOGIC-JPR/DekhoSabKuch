const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, 
    rating: { type: Number, default: 4.5 },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: Number, default: 1 }, // in years
    servicesDone: { type: Number, default: 0 },
    image: { type: String, default: null},
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', providerSchema);