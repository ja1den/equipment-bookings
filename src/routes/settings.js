// Import
const mysql = require('../lib/mysql');

// Page Size
const size = 10;

// Export Route
module.exports = async (req, res) => {
	// Require Login
	if (!req.isAuthenticated()) return res.redirect('back');

	// Execute SQL
	let records = await mysql.query('SELECT id, name, email, hidden, global FROM user;')
		.then(results => results[0])
		.catch(() => void res.status(500).send());

	if (records === undefined) return;

	// Total Pages
	const pages = Math.max(Math.ceil(records.length / size), 1);

	// Requested Page
	const page = parseFloat(req.query.page);

	// Check Page
	if (!Number.isInteger(page)) return res.redirect('?page=' + parseInt(page));

	if (isNaN(page)) return res.redirect('?page=1');

	if (page < 1) return res.redirect('?page=1');

	if (pages < page) return res.redirect('?page=' + pages);

	// Slice
	records = records.slice((page - 1) * size, page * size);

	// Render HTML
	res.render('settings', { user: req.user, records, page, pages });
}
