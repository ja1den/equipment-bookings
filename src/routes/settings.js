// Export Route
module.exports = (req, res) => {
	// Require Login
	if (!req.isAuthenticated()) return res.redirect('/');

	// Render HTML
	res.render('settings', { user: req.user });
}
