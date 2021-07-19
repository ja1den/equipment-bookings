// Import
const passport = require('passport');
const express = require('express');

// Define Routes
const router = express.Router();

// Login
router.post('/login', (req, res) => {
	try {
		// Login
		passport.authenticate('local')(req, res, () => {
			// Respond
			res.send(req.user.name);
		});
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
});

// Logout
router.get('/logout', (req, res) => {
	try {
		// Logout
		req.logout();

		// Respond
		res.end();
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
});

// Export
module.exports = router;
