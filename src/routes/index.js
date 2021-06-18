// Route Definition
async function route(req, res) {
	// Read Cookie
	const isDark = (req.headers.cookie ?? '').split(';').some(cookie => cookie.trim().startsWith('isDark='));

	// Render Page
	res.render('index', { isDark });
}

// Export
module.exports = route;
