const User = require('../models/User');

exports.paymentSuccess = async (req, res) => {
  try {
    const userId = req.userId;

    // 🛡 Safe body handling
    const amount = req.body?.amount;
    console.log("USER ID =>", req.userId);
    console.log("BODY =>", req.body);

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount is required',
      });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    // 👤 Customer payment ₹15
    if (user.role === 'customer' && amount !== 15) {
      return res.status(400).json({
        success: false,
        message: 'Customer payment must be ₹15',
      });
    }

    // 🛠 Provider payment ₹50
    if ((user.role === 'provider' || user.role === 'both') && amount !== 50) {
      return res.status(400).json({
        success: false,
        message: 'Provider payment must be ₹50',
      });
    }

    // ❗ Provider profile check
    if (
      (user.role === 'provider' || user.role === 'both') &&
      !user.isProviderProfileComplete
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete provider profile before payment',
      });
    }

    user.paymentDone = true;
    await user.save();

    res.json({
      success: true,
      message: 'Payment successful',
      data: {
        role: user.role,
        paymentDone: user.paymentDone,
        isProviderLive:
          (user.role === 'provider' || user.role === 'both') &&
          user.isProviderProfileComplete &&
          user.paymentDone,
      },
    });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
};