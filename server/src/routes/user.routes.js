const express = require('express');
const router = express.Router();
const { updateProfile, deleteAccount } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// 🔥 Update Profile (with images)
router.put(
  '/profile',
  authMiddleware,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'aadharFrontImage', maxCount: 1 },
    { name: 'aadharBackImage', maxCount: 1 },
  ]),
  updateProfile
);

// 🗑 Delete Account
router.delete('/delete', authMiddleware, deleteAccount);

module.exports = router;