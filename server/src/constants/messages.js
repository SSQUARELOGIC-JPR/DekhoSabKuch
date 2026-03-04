module.exports = {
  auth: {
    mobileRequired: 'Mobile is required',
    invalidMobile: 'Invalid mobile number',
    otpSent: 'OTP sent successfully',
    invalidOtp: 'Invalid OTP',
    loginSuccess: 'Login successful',
    roleSaved: 'Role saved successfully',
    userNotFound: 'User not found',
    unauthorized: 'Unauthorized access',
    invalidToken: 'Invalid or expired token',
    tooManyOtp: 'Too many OTP requests. Please try again after 2 minutes.',
  },

  user: {
    profileUpdated: 'Profile updated successfully',
    mobileMismatch: 'Mobile number does not match',
    accountDeleted: 'Account deleted successfully',
    deleteFailed: 'Failed to delete account',
  },

  provider: {
    detailsRequired: 'Provider details (category, experience, about) are required',
    aadharFrontRequired: 'Aadhaar front image is required',
    aadharBackRequired: 'Aadhaar back image is required',
    invalidExperience: 'Experience must be between 0 and 50 years',
    notFound: "Provider not found",
    notActive: "Provider is not active",
    paymentRequired: "Please complete payment to view provider details"
  },

  common: {
    serverError: 'Something went wrong',
    invalidId: 'Invalid ID',
    notFound: 'Resource not found',
  },
  payment: {
    amountRequired: "Payment amount is required",
    customerAmountInvalid: "Customer payment must be ₹15",
    providerAmountInvalid: "Provider payment must be ₹50",
    providerProfileIncomplete: "Complete provider profile before payment",
    success: "Payment successful",
    failed: "Payment failed"
  },
  support: {
    fieldsRequired: "All fields are required",
    created: "Support ticket created successfully"
  },
  notification: {
    welcomeTitle: "Welcome 🎉",
    welcomeMessage: "Welcome to Dekho Sab Kuch!",

    paymentTitle: "Payment Successful",
    paymentMessage: "Your payment was completed successfully.",

    supportTitle: "Support Request Submitted",
    supportMessage: "Your support ticket has been received. Our team will contact you soon.",

    providerLiveTitle: "Profile Live 🎉",
    providerLiveMessage: "Your provider profile is now live and visible to customers.",
  },
};