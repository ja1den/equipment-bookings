// Import
const express = require('express');

const { Op, ValidationError } = require('sequelize');

// Lib
const sequelize = require('../../lib/sequelize');
const auth = require('../../middleware/auth');

const mail = require('../../lib/mail');

// Define Routes
const router = express.Router();

// Create
router.post('/', async (req, res) => {
	try {
		// Prevent Empty
		if (!Array.isArray(req.body.items) || req.body.items.length === 0) return res.status(400).end();

		// Parse Dates
		req.body.start_date = new Date(req.body.start_date);
		req.body.end_date = new Date(req.body.end_date);

		// Create Booking
		const { id } = await sequelize.models.booking.create(req.body);

		// Create Booking Items
		await Promise.all(req.body.items.map(item => sequelize.models.booking_item.create({
			booking_id: id, item_id: item[0], quantity: item[1]
		})));

		// Send Mail
		if (req.body.user_id === undefined) req.body.user_id = '-1';

		const teacherInfo = await sequelize.models.user.findAll({
			where: {
				[Op.or]: [
					{ id: req.body.user_id },
					{ global: true }
				]
			}
		});

		mail.scheduleMail(req.body.start_date, req.body.email, req.body.name);

		for (let i = 0; i < teacherInfo.length; i++) {
			mail.notifyUsers(req.body.start_date, teacherInfo[i].email, req.body.name, teacherInfo[i].name);
		}

		// Respond
		res.status(201).send(id.toString());
	} catch (e) {
		// Validation
		if (e instanceof ValidationError) return res.status(400).end();

		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
});

// Read
router.get('/', async (req, res) => {
	try {
		// Parse Dates
		const start_date = new Date(req.query.start_date);
		const end_date = new Date(req.query.end_date);

		if (isNaN(start_date.getTime())) return res.status(400).end();
		if (isNaN(end_date.getTime())) return res.status(400).end();

		// Determine Includes
		let includes;

		if (req.isAuthenticated()) {
			includes = [
				{
					model: sequelize.models.user,
					attributes: {
						exclude: ['password']
					}
				},
				{
					model: sequelize.models.item
				}
			];
		} else {
			includes = [
				{
					model: sequelize.models.item
				}
			];
		}

		// Read Bookings
		const bookings = await sequelize.models.booking.findAll({
			where: {
				start_date: {
					[Op.lt]: end_date
				},
				end_date: {
					[Op.gt]: start_date
				}
			},
			attributes: !req.isAuthenticated() ? ['id', 'start_date', 'end_date'] : undefined,
			include: includes
		});

		// Respond
		res.send(bookings);
	} catch (e) {
		// Validation
		if (e instanceof RangeError) return res.status(400).end();

		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
});

// Delete
router.delete('/:id', auth, async (req, res) => {
	try {
		// Delete
		await sequelize.models.booking.destroy({ where: { id: req.params.id } });

		// Respond
		res.status(204).end();
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
});

// Export
module.exports = router;
