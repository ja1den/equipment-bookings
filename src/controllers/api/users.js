// Import
const express = require('express');

// Lib
const auth = require('../../middleware/auth');
const models = require('../../models');

// Define Routes
const router = express.Router();

// Create
router.post('/', auth, (req, res) => {
	// Global
	if (!req.user.global) return res.status(401).end();

	// Execute
	models.user.create(req.body).then(id => res.status(201).send(id.toString()))
		.catch(err => {
			// Joi
			if (err.details !== undefined) return res.status(400).end();

			// Duplicate Record
			if (err.code === 'ER_DUP_ENTRY') return res.status(409).end();

			// Unknown
			res.status(500).end();
		});
});

// Read
router.get('/', auth, async (_req, res) => {
	// Read Users
	const users = await models.user.readAll().catch(() => res.status(500).end());

	// Remove Passwords
	users.forEach(user => delete user.password);

	// Respond
	res.send(users);
});

// Update
router.put('/:id', auth, async (req, res) => {
	// Check Role
	if (req.user.id === parseInt(req.params.id)) {
		if (req.user.global !== req.body.global) return res.status(403).end();
	} else {
		if (!req.user.global) return res.status(401).end();
	}

	// Update Fields
	await models.user.update(req.params.id, req.body)
		.catch(err => {
			// Joi
			if (err.details !== undefined) return res.status(400).end();

			// Unknown
			res.status(500).end();
		});

	// Change Password
	if (req.body.password !== undefined) {
		await models.user.changePassword(req.params.id, req.body.password)
			.catch(() => res.status(500).end());
	}

	// Respond
	res.status(204).end();
});

// Delete
router.delete('/:id', auth, (req, res) => {
	// Global
	if (!req.user.global) return res.status(401).end();

	// Ignore Current
	if (req.user.id === parseInt(req.params.id)) return res.status(403).end();

	// Execute
	models.user.delete(req.params.id).then(() => res.status(204).end())
		.catch(() => res.status(500).end());
});

// Export
module.exports = router;
