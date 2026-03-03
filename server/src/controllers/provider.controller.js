const User = require('../models/User');
const mongoose = require('mongoose');
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

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // 🔍 Current logged-in user
    const currentUser = await User.findById(currentUserId).lean();

    const isSelfActiveProvider =
      currentUser &&
      (currentUser.role === 'provider' || currentUser.role === 'both') &&
      currentUser.isProviderProfileComplete &&
      currentUser.paymentDone &&
      currentUser.isAvailable;

    // 🧾 Step 1: Get all ACTIVE providers (completed + paid)
    let providers = await User.find({
      role: { $in: ['provider', 'both'] },
      isProviderProfileComplete: true,
      paymentDone: true,
      isAvailable: true,
    }).lean();

    // ❗ Step 2: Self visibility rule
    if (!isSelfActiveProvider) {
      // Remove self if not fully active provider
      providers = providers.filter(
        (p) => p._id.toString() !== currentUserId.toString()
      );
    }

    // 🔥 Mask phone if user not paid
    const isPaidUser = currentUser?.paymentDone;

    providers = providers.map((p) => ({
      ...p,
      mobile: isPaidUser
        ? p.mobile
        : p.mobile
        ? p.mobile.slice(0, 5) + '*****'
        : '',
    }));

    // 🎯 Step 3: Sort by category priority + latest
    providers.sort((a, b) => {
      const catDiff =
        categoryPriority.indexOf(a.category) -
        categoryPriority.indexOf(b.category);

      if (catDiff !== 0) return catDiff;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 📄 Step 4: Pagination
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
      message: 'Failed to fetch providers',
    });
  }
};

// 🔍 Provider Detail API
exports.getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider id',
      });
    }

    // 🛠 Fetch provider first
    const provider = await User.findOne({
      _id: id,
      role: { $in: ['provider', 'both'] },
      isProviderProfileComplete: true,
      paymentDone: true,
      isAvailable: true,
    }).lean();

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found or not active',
      });
    }

    // 👤 Fetch viewer (optional safe)
    const currentUser = await User.findById(req.userId).lean();

    // 🔐 If viewer exists but unpaid → block
    if (currentUser && !currentUser.paymentDone) {
      return res.status(403).json({
        success: false,
        message: 'Please complete payment to view provider details',
      });
    }

    // 🧠 If user not found → treat as unpaid guest
    if (!currentUser) {
      return res.status(403).json({
        success: false,
        message: 'Session expired, please login again',
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;

    return res.json({
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
      message: error.message,
    });
  }
};