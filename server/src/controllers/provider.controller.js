const User = require('../models/User');
const mongoose = require('mongoose');
const messages = require('../constants/messages');

const categoryPriority = [
  'Electrician',
  'Plumber',
  'Salon',
  'AC Repair',
  'Carpenter',
  'Painter',
  'Cleaning',
  'Pest Control',
  'Appliance Repair',
  'Beauty & Makeup',
];

exports.getProviders = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    const currentUserId = req.userId;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;

    // 🔍 Current logged-in user
    const currentUser = await User.findById(currentUserId).lean();

    const isSelfActiveProvider =
      currentUser &&
      (currentUser.role === 'provider' || currentUser.role === 'both') &&
      currentUser.isProviderProfileComplete &&
      currentUser.paymentDone &&
      currentUser.isAvailable;

    // 🧾 Get all ACTIVE providers
    let providers = await User.find({
      role: { $in: ['provider', 'both'] },
      isProviderProfileComplete: true,
      paymentDone: true,
      isAvailable: true,
    }).lean();

    // ❗ Remove self if not active provider
    if (!isSelfActiveProvider) {
      providers = providers.filter(
        (p) => p._id.toString() !== String(currentUserId)
      );
    }

    // 🔐 Phone masking for unpaid users
    const isPaidUser = currentUser?.paymentDone;

    providers = providers.map((p) => ({
      ...p,
      mobile:
        isPaidUser || !p.mobile
          ? p.mobile
          : `${p.mobile.slice(0, 5)}*****`,
    }));

    // 🎯 Sort by category priority + latest
    providers.sort((a, b) => {
      const aIndex = categoryPriority.indexOf(a.category);
      const bIndex = categoryPriority.indexOf(b.category);

      const catDiff =
        (aIndex === -1 ? 999 : aIndex) -
        (bIndex === -1 ? 999 : bIndex);

      if (catDiff !== 0) return catDiff;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 📄 Pagination
    const paginatedProviders = providers.slice(skip, skip + limit);

    res.json({
      success: true,
      providers: paginatedProviders,
      pagination: {
        page,
        limit,
        total: providers.length,
        pages: Math.ceil(providers.length / limit),
      },
    });
  } catch (error) {
    console.error('Get Providers Error:', error);
    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};

// 🔍 Provider Detail API
exports.getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: messages.common.invalidId,
      });
    }

    // 👤 Fetch provider
    const provider = await User.findById(id).lean();

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: messages.provider.notFound,
      });
    }

    // 🚫 Check if provider is active
    if (
      !['provider', 'both'].includes(provider.role) ||
      !provider.isProviderProfileComplete ||
      !provider.paymentDone ||
      !provider.isAvailable
    ) {
      return res.status(404).json({
        success: false,
        message: messages.provider.notActive,
      });
    }

    // 👤 Current logged-in user
    const currentUser = await User.findById(req.userId).lean();

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: messages.auth.unauthorized,
      });
    }

    // 🔐 If unpaid user → block detail
    if (!currentUser.paymentDone) {
      return res.status(403).json({
        success: false,
        message: messages.provider.paymentRequired,
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;

    res.json({
      success: true,
      provider: {
        _id: provider._id,
        name: provider.name,
        mobile: provider.mobile,
        city: provider.city,
        state: provider.state,
        category: provider.category,
        experience: provider.experience,
        about: provider.about,
        rating: provider.rating,
        servicesDone: provider.servicesDone,
        isAvailable: provider.isAvailable,
        profileImage: provider.profileImage
          ? `${baseUrl}/${provider.profileImage}`
          : '',
      },
    });

  } catch (error) {
    console.error('Get Provider Detail Error:', error);

    res.status(500).json({
      success: false,
      message: messages.common.serverError,
    });
  }
};