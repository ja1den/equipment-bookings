// Export Route
module.exports = (req, res) => {
	if (!req.isAuthenticated()) return res.status(401).end();

	res.send(req.user.name);
}
