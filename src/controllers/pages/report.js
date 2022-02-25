// Import
const { DateTime } = require('luxon');

const { Op } = require('sequelize');

// Lib
const sequelize = require('../../lib/sequelize');

// Main
module.exports = async (req, res) => {
	try {
		// Require Login
		if (!req.isAuthenticated()) return res.redirect('/');

		// Default Date
		if (req.query.date === undefined) {
			return res.redirect('?date=' + DateTime.now().toISODate());
		}

		// Parse Date
		req.query.date = new Date(req.query.date);

		// Calculate Dates
		const dates = [
			DateTime.fromJSDate(req.query.date).toISODate(),
			DateTime.fromJSDate(req.query.date).set({ hours: 0, minute: 0, second: 0, millisecond: 0 }).toJSDate(),
			DateTime.fromJSDate(req.query.date).set({ hour: 24, minute: 0, second: 0, millisecond: 0 }).toJSDate(),
		];

		// Read Bookings
		const bookings = await sequelize.models.booking.findAll({
			where: {
				start_date: {
					[Op.lt]: dates[2],
				},
				end_date: {
					[Op.gt]: dates[1],
				},
			},
			include: [
				sequelize.models.user,
				sequelize.models.item,
			],
		});

		// Render HTML
		res.render('report', { user: req.user, date: dates[0], bookings });
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
};
