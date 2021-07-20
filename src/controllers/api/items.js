// Import
const express = require('express');

const { ValidationError } = require('sequelize');

// Lib
const sequelize = require('../../lib/sequelize');
const auth = require('../../middleware/auth');

// Define Routes
const router = express.Router();

// Create
router.post('/', auth, async (req, res) => {
	try {
		// Create
		const { id } = await sequelize.models.item.create(req.body);

		// Respond
		res.status(201).send(id.toString());
	} catch (e) {
		// Validation
		if (e instanceof ValidationError) return res.status(400).end();

		// Duplicate Record
		if (e.code === 'ER_DUP_ENTRY') return res.status(409).end();

		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
});

// Read
router.get('/', auth, async (_req, res) => {
	try {
		// Find All
		const items = await sequelize.models.item.findAll();

		// Respond
		res.send(items);
	} catch (e) {
		// Log
		console.error(e);

		// Respond
		res.status(500).end();
	}
});

// Update
router.patch('/:id', auth, async (req, res) => {
	try {
		// Read Record
		const item = await sequelize.models.item.findByPk(req.params.id);

		// Update Fields
		for (const key of Object.keys(req.body)) item[key] = req.body[key];

		// Update
		await item.save();

		// Respond
		res.status(204).end();
	} catch (e) {
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
		await sequelize.models.item.destroy({ where: { id: req.params.id } });

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
