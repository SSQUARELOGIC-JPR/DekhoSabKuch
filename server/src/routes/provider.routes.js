const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getProviders, getProviderById } = require('../controllers/provider.controller');

// Apply auth middleware to all routes
router.use(authMiddleware);

// List Providers
router.get('/', getProviders);

// Provider Detail
router.get('/:id', getProviderById);

module.exports = router;