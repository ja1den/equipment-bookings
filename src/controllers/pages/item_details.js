// Import
const { DateTime } = require('luxon');

// Lib
const sequelize = require('../../lib/sequelize');

// Export Route
module.exports = async (req, res) => {
	try {
		// Read Items
		const items = await sequelize.models.item.findAll({ order: [['category'], ['name']] });

		if (req.query.item_id === undefined) {
			return res.redirect('?item_id=' + items[0].id);
		}

		// Read Booking Items
		let records = await sequelize.models.booking_item.findAll({
			where: {
				item_id: req.query.item_id,
			},
			include: [
				sequelize.models.booking,
				sequelize.models.item,
			],
		});

		records = records.map(record => record.get({ plain: true }));

		// Determine Categories
		const categories = [...new Set(items.map(item => item.category))];

		// Format Dates
		records.forEach(record => record.booking.linkDate = DateTime.fromJSDate(record.booking.start_date).toISO({ suppressSeconds: true }).split('T')[0]);

		// Render HTML
		res.render('item_details', { user: req.user, categories, items, item_id: req.query.item_id, records });
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
};
