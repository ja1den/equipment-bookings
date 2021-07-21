// Import
const express = require('express');

const { Op, ValidationError } = require('sequelize');
const { DateTime } = require('luxon');

// Lib
const sequelize = require('../../lib/sequelize');

// Define Routes
const router = express.Router();

// Read
router.get('/', async (req, res) => {
	try {
		// Parse Dates
		const dates = [
			DateTime.fromISO(req.query.start_date, { zone: 'utc' }),
			DateTime.fromISO(req.query.end_date, { zone: 'utc' })
		];

		if (dates[0].invalidReason !== null) return res.status(400).end();
		if (dates[1].invalidReason !== null) return res.status(400).end();

		// Read Bookings
		const bookings = await sequelize.models.booking.findAll({
			where: {
				start_time: {
					[Op.lt]: dates[1].toJSDate()
				},
				end_time: {
					[Op.gt]: dates[0].toJSDate()
				}
			},
			attributes:
				!req.isAuthenticated()
					? ['id', 'startTime', 'endTime']
					: undefined,
			include: req.isAuthenticated() ? [
				{
					model: sequelize.models.user,
					attributes: {
						exclude: ['password']
					}
				},
				{
					model: sequelize.models.item
				}
			] : [
				{
					model: sequelize.models.item
				}
			]
		});

		// Respond
		res.send(bookings);
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
});

// Export
module.exports = router;
