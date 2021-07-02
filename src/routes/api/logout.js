// Export Route
module.exports = (req, res) => {
	req.logout();
	res.redirect('/');
}
