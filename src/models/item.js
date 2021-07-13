// Import
const Joi = require('joi');

// Lib
const mysql = require('../helpers/mysql');

// Joi
const schema = Joi.object({
	name: Joi.string().required(),
	category: Joi.string().required(),
	stock: Joi.number().required(),
	hidden: Joi.boolean().required()
});

/**
 * Create a new item, using the parameters provided.
 */
exports.create = params => new Promise(async (resolve, reject) => {
	// Schema Check
	const { error } = schema.validate(params);

	if (error !== undefined) return reject(error);

	// Insert Record
	const result = await mysql.query('INSERT INTO item VALUES (NULL, ?, ?, ?, ?)', [
		params.name,
		params.category,
		params.stock,
		params.hidden
	])
		.catch(reject);

	if (result === undefined) return;

	// Return
	return resolve(result[0].insertId);
});

/**
 * Read a single item from the database.
 */
exports.read = id => new Promise(async (resolve, reject) => {
	// Execute SQL
	const item = await mysql.query('SELECT * FROM item WHERE id = ?', [id])
		.then(result => result[0][0]).catch(reject);

	// Parse Boolean
	item.hidden = Boolean(item.hidden);

	// Return
	return resolve(item);
});

/**
 * Read every item from the database.
 */
exports.readAll = () => new Promise(async (resolve, reject) => {
	// Execute SQL
	const items = await mysql.query('SELECT * FROM item ORDER BY category, name')
		.then(result => result[0]).catch(reject);

	// Parse Boolean
	items.forEach(item => item.hidden = Boolean(item.hidden));

	// Return
	return resolve(items);
});

/**
 * Read every unique category from the database.
 */
exports.readCategories = () => mysql.query('SELECT DISTINCT category FROM item').then(result => result[0].map(record => record.category));

/**
 * Update an item using the parameters provided.
 */
exports.update = (id, params) => new Promise(async (resolve, reject) => {
	// Schema Check
	const { error } = schema.validate(params);

	if (error !== undefined) return reject(error);

	// Update Record
	const result = await mysql.query('UPDATE item SET name = ?, category = ?, stock = ?, hidden = ? WHERE id = ?', [
		params.name,
		params.category,
		params.stock,
		params.hidden,
		id
	])
		.catch(reject);

	if (result === undefined) return;

	// Return
	return resolve();
});

/**
 * Delete an item from the database.
 */
exports.delete = id => mysql.query('DELETE FROM item WHERE id = ?', [id]);
