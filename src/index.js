// Import
const path = require('path');
const fs = require('fs');

const minimist = require('minimist');

const express = require('express');
const session = require('express-session');

const SessionStore = require('express-mysql-session')(session);

require('colors');

// Lib
const sequelize = require('./lib/sequelize');
const passport = require('./lib/passport');

// Start
const start = async () => {
	// Log
	const start = Date.now();

	// Read Port
	const args = minimist(process.argv.slice(2), { alias: { p: 'port' } });

	const port = typeof args.port === 'number'
		? args.port
		: 3000;

	// Sequelize
	try {
		await sequelize.authenticate();
	} catch (e) {
		console.error('Sequelize connection failed!'.red, e);
		return;
	}

	// Load Models
	require('./models/associate');

	// Express
	const app = express().use(express.json());

	// Session
	const connection = (await sequelize.connectionManager.getConnection()).promise();

	app.use(session({
		secret: 'group-project',
		store: new SessionStore({ schema: { tableName: 'session', columnNames: { session_id: 'id' } } }, connection),
		resave: false,
		saveUninitialized: false
	}));

	// Passport
	app.use(passport.initialize());
	app.use(passport.session());

	// Pug
	app.use((req, res, next) => {
		res.locals.current_url = req.url;
		next();
	});
	app.use(express.urlencoded({extended: true}));
	app.use(express.json())

	
	app.set('view engine', 'pug');

	// Load Routes
	app.use(require('./controllers'));

	// Public Files
	app.use(express.static(path.resolve(__dirname, '..', 'public')));

	// 404
	app.use((_req, res) => res.status(404).end());

	// Listen
	app.listen(port, () => {
		console.log('Server running at', ('http://localhost:' + port).cyan);
		console.log(`\u2728  Up in ${Date.now() - start}ms.`.green);
	});

	// Handle Exit
	['SIGINT', 'SIGTERM', 'SIGUSR2'].map(signal => {
		process.addListener(signal, () => process.exit());
	});
};
start();
