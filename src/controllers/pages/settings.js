// Import
const sequelize = require('../../lib/sequelize');

// Page Size
const size = 10;

// Export Route
module.exports = async (req, res) => {
	try {
		// Require Login
		if (!req.isAuthenticated()) return res.redirect('/');

		// Read Users
		let records = await sequelize.models.user.findAll().catch(() => res.status(500).send());

		if (records === undefined) return;

		// Total Pages
		const pages = Math.max(Math.ceil(records.length / size), 1);

		// Requested Page
		const page = parseFloat(req.query.page);

		// Check Page
		if (isNaN(page)) return res.redirect('?page=1');

		if (!Number.isInteger(page)) return res.redirect('?page=' + parseInt(page));

		if (page < 1) return res.redirect('?page=1');

		if (pages < page) return res.redirect('?page=' + pages);

		// Slice
		records = records.slice((page - 1) * size, page * size);

		// Render HTML
		res.render('settings', { user: req.user, records, page, pages });
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
}
