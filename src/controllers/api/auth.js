// Import
const passport = require('passport');
const express = require('express');

// Define Routes
const router = express.Router();

// Login
router.post('/login', (req, res) => passport.authenticate('local')(req, res, () => res.send(req.user.name)));

// Logout
router.get('/logout', (req, res) => req.logout() ?? res.end());

// Export
module.exports = router;
