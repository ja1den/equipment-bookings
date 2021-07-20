// Import
const express = require('express');
const bcrypt = require('bcrypt');

const { ValidationError } = require('sequelize');

// Lib
const sequelize = require('../../lib/sequelize');
const auth = require('../../middleware/auth');

// Define Routes
const router = express.Router();

// Create
router.post('/', auth, async (req, res) => {
	try {
		// Global
		if (!req.user.global) return res.status(401).end();

		// Password Length
		if (req.body.password === undefined) return res.status(400).end();
		if (req.body.password.length < 5) return res.status(400).end();

		// Bcrypt Hash
		const hash = await bcrypt.hash(req.body.password, 10);

		// Create
		const { id } = await sequelize.models.user.create({ ...req.body, password: hash });

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
		const users = await sequelize.models.user.findAll({ attributes: { exclude: ['password'] } });

		// Respond
		res.send(users);
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
		// Check Role
		if (req.user.id === parseInt(req.params.id)) {
			if (req.body.global !== undefined && req.user.global !== req.body.global) return res.status(403).end();
		} else {
			if (!req.user.global) return res.status(401).end();
		}

		// Read Record
		const user = await sequelize.models.user.findByPk(req.params.id);

		// Update Fields
		for (const key of Object.keys(req.body)) user[key] = req.body[key];

		// Update Password
		if (req.body.password !== undefined) {
			// Password Length
			if (req.body.password.length < 5) return res.status(400).end();

			// Bcrypt Hash
			user.password = await bcrypt.hash(req.body.password, 10);
		}

		// Update
		await user.save();

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
		// Global
		if (!req.user.global) return res.status(401).end();

		// Ignore Current
		if (req.user.id === parseInt(req.params.id)) return res.status(403).end();

		// Delete
		await sequelize.models.user.destroy({ where: { id: req.params.id } });

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
