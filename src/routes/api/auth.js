// Import
const passport = require('passport');

// Export Route
module.exports = (req, res) => {
	// Switch on Method
	switch (req.method) {
		case 'GET':
			// Log Out
			req.logout();

			// Emit Response
			res.end();
			break;

		case 'POST':
			// Log In
			passport.authenticate('local')(req, res, () => res.send(req.user.name));
			break;

		default:
			// Invalid Method
			res.status(405).end();
			break;
	}
}
