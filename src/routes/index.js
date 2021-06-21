// Import
const parseCookie = require('../lib/parseCookie');

// Export Route
module.exports = async function (req, res) {
	// Parse Cookie
	const isDark = parseCookie(req.headers.cookie ?? '').isDark !== undefined;

	// Render Page
	res.render('index', { isDark });
}
