// Import
const models = require('../../models');

// Page Size
const size = 10;

// Export Route
module.exports = async (req, res) => {
	// Require Login
	if (!req.isAuthenticated()) return res.redirect('/');

	// Execute SQL
	let records = await models.item.readAll().catch(() => res.status(500).send());

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

	// Read Categories
	const categories = await models.item.readCategories();

	// Render HTML
	res.render('catalogue', { user: req.user, records, page, pages, categories });
}
