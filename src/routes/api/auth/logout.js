// Export Route
module.exports = (req, res) => {
	// Invalid Method
	if (req.method !== 'GET') res.status(405).end();

	// Log Out
	req.logout();

	// Emit Response
	res.end();
}
