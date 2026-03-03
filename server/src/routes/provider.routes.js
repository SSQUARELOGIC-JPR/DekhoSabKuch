const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getProviders, getProviderById } = require('../controllers/provider.controller');

// List
router.get('/providers', authMiddleware, getProviders);

// Detail
router.get('/providers/:id', authMiddleware, getProviderById);

module.exports = router;