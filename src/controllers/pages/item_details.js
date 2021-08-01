// Imports
const { DateTime } = require('luxon');

// Lib
const sequelize = require('../../lib/sequelize');

// Export Route
module.exports = async (req, res) => {
	try {
		// Read Items
		const items = await sequelize.models.item.findAll();

		if (req.query.item_id === undefined) {
			return res.redirect('?item_id=' + items[0].id);
		}

		// Read Booking Items
		let records = await sequelize.models.booking_item.findAll({
			where: {
				item_id: req.query.item_id
			},
			include: sequelize.models.booking
		});

		records = records.map(record => record.get({ plain: true }));

		// Render HTML
		res.render('item_details', { user: req.user, items, item_id: req.query.item_id, records });
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
}
