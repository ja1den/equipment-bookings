// Import
const minimist = require('minimist');
const path = require('path');

const express = require('express');
const session = require('express-session');

const SessionStore = require('express-mysql-session')(session);

require('colors');

// Helpers
const passport = require('./helpers/passport');
const mysql = require('./helpers/mysql');

// Log
const time = Date.now();

// Read Port
const args = minimist(process.argv.slice(2), { alias: { p: 'port' } });

const port = typeof args.port === 'number'
	? args.port
	: 3000;

// Express
const app = express().use(express.json());

app.use(session({
	secret: 'group-project',
	store: new SessionStore({ schema: { tableName: 'session', columnNames: { session_id: 'id' } } }, mysql),
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
	console.log(`\u2728  Up in ${Date.now() - time}ms.`.green);
});

// Handle Exit
['SIGINT', 'SIGTERM', 'SIGUSR2'].map(signal => {
	process.addListener(signal, () => process.exit());
});
