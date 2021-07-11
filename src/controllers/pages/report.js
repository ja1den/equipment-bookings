// Export Route
module.exports = (req, res) => {
	// Require Login
	if (!req.isAuthenticated()) return res.redirect('/');

	// Render HTML
	res.render('report', { user: req.user });
}
