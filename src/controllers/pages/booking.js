// Import
const { DateTime } = require('luxon');

// Lib
const sequelize = require('../../lib/sequelize');

// Export Route
module.exports = async (req, res) => {
	try {
		// Read Users
		const users = await sequelize.models.user.findAll();

		// Calculate Times
		const dates = [
			DateTime.now().set({ hour: 24, minutes: 0, second: 0, millisecond: 0 }).toFormat("yyyy-MM-dd'T'T"),
			DateTime.now().set({ hour: 13, minute: 10, second: 0, millisecond: 0 }).plus({ days: 1 }).toFormat("yyyy-MM-dd'T'T"),
			DateTime.now().set({ hour: 11, minute: 15, second: 0, millisecond: 0 }).plus({ days: 2 }).toFormat("yyyy-MM-dd'T'T")
		];

		// Render HTML
		res.render('booking', { user: req.user, users, dates });
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
}
