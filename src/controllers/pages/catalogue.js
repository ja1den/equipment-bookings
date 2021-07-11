// Export Route
module.exports = (req, res) => {
	// Require Login
	if (!req.isAuthenticated()) return res.redirect('/');

	// Render HTML
	res.render('catalogue', { user: req.user });
}
