// Import
const express = require('express');

// Lib
const auth = require('../../middleware/auth');
const models = require('../../models');

// Define Routes
const router = express.Router();

// Create
router.post('/', auth, (req, res) => {
	models.item.create(req.body).then(id => res.status(201).send(id.toString()))
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
router.get('/', auth, (_req, res) => {
	models.item.readAll().then(items => res.send(items))
		.catch(() => res.status(500).end())
});

// Update
router.put('/:id', auth, async (req, res) => {
	models.item.update(req.params.id, req.body).then(() => res.status(204).end())
		.catch(err => {
			// Joi
			if (err.details !== undefined) return res.status(400).end();

			// Unknown
			res.status(500).end();
		});
});

// Delete
router.delete('/:id', auth, (req, res) => {
	models.item.delete(req.params.id).then(() => res.status(204).end())
		.catch(() => res.status(500).end());
});

// Export
module.exports = router;
