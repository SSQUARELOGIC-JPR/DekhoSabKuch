const User = require('../models/User');
const messages = require('../constants/messages');
const createNotification = require('../../utills/createNotification')

exports.paymentSuccess = async (req, res) => {
  try {
    const userId = req.userId;

    const amount = Number(req.body?.amount);

    console.log("USER ID =>", userId);
    console.log("BODY =>", req.body);

    // 🔍 Amount validation
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: messages.payment.amountRequired,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.auth.userNotFound,
      });
    }

    // 👤 Customer payment ₹15
    if (user.role === 'customer' && amount !== 15) {
      return res.status(400).json({
        success: false,
        message: messages.payment.customerAmountInvalid,
      });
    }

    // 🛠 Provider payment ₹50
    if ((user.role === 'provider' || user.role === 'both') && amount !== 50) {
      return res.status(400).json({
        success: false,
        message: messages.payment.providerAmountInvalid,
      });
    }

    // ❗ Provider profile check
    if (
      (user.role === 'provider' || user.role === 'both') &&
      !user.isProviderProfileComplete
    ) {
      return res.status(400).json({
        success: false,
        message: messages.payment.providerProfileIncomplete,
      });
    }

    // ✅ Mark payment done
    user.paymentDone = true;
    await user.save();

    res.json({
      success: true,
      message: messages.payment.success,
      data: {
        role: user.role,
        paymentDone: user.paymentDone,
        isProviderLive:
          (user.role === 'provider' || user.role === 'both') &&
          user.isProviderProfileComplete &&
          user.paymentDone,
      },
    });

    await createNotification({
      user: user._id,
      title: messages.notification.paymentTitle,
      message: messages.notification.paymentMessage,
      type: "payment",
    });

    if (user.role === 'provider' || user.role === 'both') {
      await createNotification({
        user: user._id,
        title: messages.notification.providerLiveTitle,
        message: messages.notification.providerLiveMessage,
        type: "provider_live",
      });
    }

  } catch (error) {
    console.error('Payment Error:', error);

    res.status(500).json({
      success: false,
      message: messages.payment.failed,
    });
  }
};