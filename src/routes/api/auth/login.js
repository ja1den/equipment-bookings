// Import
const passport = require('passport');

// Export Route
module.exports = (req, res) => {
	// Invalid Method
	if (req.method !== 'POST') res.status(405).end();

	// Log In
	passport.authenticate('local')(req, res, () => res.send(req.user.name));
}
