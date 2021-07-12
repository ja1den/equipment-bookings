// Import
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Lib
const mysql = require('../helpers/mysql');

// Joi
const schema = [
	Joi.object({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		global: Joi.boolean().required(),
		hidden: Joi.boolean().required()
	}),
	Joi.object({
		password: Joi.string().min(4).required(),
	})
];

/**
 * Create a new user, using the parameters provided.
 */
exports.create = params => new Promise(async (resolve, reject) => {
	// Schema Check
	const { error } = schema[0].concat(schema[1]).validate(params);

	if (error !== undefined) return reject(error);

	// Generate Hash
	const hash = await bcrypt.hash(params.password, 10).catch(reject);

	if (hash === undefined) return;

	// Insert Record
	const result = await mysql.query('INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?)', [
		params.name,
		params.email,
		hash,
		params.global,
		params.hidden
	])
		.catch(reject);

	if (result === undefined) return;

	// Return
	return resolve(result[0].insertId);
});

/**
 * Read a single user from the database.
 */
exports.read = id => new Promise(async (resolve, reject) => {
	// Execute SQL
	const user = await mysql.query('SELECT * FROM user WHERE id = ?', [id])
		.then(result => result[0][0]).catch(reject);

	// Parse Boolean
	user.global = Boolean(user.global);
	user.hidden = Boolean(user.hidden);

	// Return
	return resolve(user);
});

/**
 * Read every user from the database.
 */
exports.readAll = () => new Promise(async (resolve, reject) => {
	// Execute SQL
	const users = await mysql.query('SELECT * FROM user ORDER BY id')
		.then(result => result[0]).catch(reject);

	// Parse Boolean
	users.forEach(user => {
		user.global = Boolean(user.global);
		user.hidden = Boolean(user.hidden);
	});

	// Return
	return resolve(users);
});

/**
 * Update a specific user using the parameters provided.
 */
exports.update = (id, params) => new Promise(async (resolve, reject) => {
	// Schema Check
	const { error } = schema[0].validate(params, { allowUnknown: true });

	if (error !== undefined) return reject(error);

	// Update Record
	const result = await mysql.query('UPDATE user SET name = ?, email = ?, global = ?, hidden = ? WHERE id = ?', [
		params.name,
		params.email,
		params.global,
		params.hidden,
		id
	])
		.catch(reject);

	if (result === undefined) return;

	// Return
	return resolve();
});

/**
 * Change a user's password.
 */
exports.changePassword = (id, password) => new Promise(async (resolve, reject) => {
	// Generate Hash
	const hash = await bcrypt.hash(password, 10).catch(reject);

	if (hash === undefined) return;

	// Update Record
	const result = await mysql.query('UPDATE user SET password = ? WHERE id = ?', [hash, id])
		.catch(reject);

	if (result === undefined) return;

	// Return
	return resolve();
});

/**
 * Delete a user from the database.
 */
exports.delete = id => mysql.query('DELETE FROM user WHERE id = ?', [id]);

/**
 * Locate a user using their email and password.
 */
exports.login = (email, password) => new Promise(async (resolve, reject) => {
	// Email
	const user = await mysql.query('SELECT * FROM user WHERE user.email = ?', [email])
		.then(result => result[0][0]).catch(reject);

	if (user === undefined) return reject();

	// Password
	if (!(await bcrypt.compare(password, user.password))) return reject();

	// Parse Boolean
	user.global = Boolean(user.global);
	user.hidden = Boolean(user.hidden);

	// Return
	return resolve(user);
});
