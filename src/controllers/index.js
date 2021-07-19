// Import
const express = require('express');

// Define Routes
const router = express.Router();

router.use('/api/bookings', require('./api/bookings'));
router.use('/api/items', require('./api/items'));
router.use('/api/users', require('./api/users'));

router.use('/api/auth', require('./api/auth'));

router.get('/catalogue', require('./pages/catalogue'));
router.get('/item_details', require('./pages/item_details'));
router.get('/report', require('./pages/report'));
router.get('/settings', require('./pages/settings'));
router.get('/', require('./pages/booking'));

// Export
module.exports = router;
