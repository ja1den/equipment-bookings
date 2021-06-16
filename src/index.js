// Import
const path = require('path');

const minimist = require('minimist');
const express = require('express');

require('colors');

// Lib
const getPaths = require('./lib/getPaths');

// Main
async function main() {
	// Log
	const time = Date.now();

	// Read Port
	const args = minimist(process.argv.slice(2), { alias: { p: 'port' } });

	const port = typeof args.port === 'number'
		? args.port
		: 3000;

	// Express
	const app = express().use(express.json());

	// Pug
	app.set('view engine', 'pug');

	// Load Routes
	const routes = getPaths(path.resolve(__dirname, 'routes'));

	for (const route of routes) {
		// Route Name
		let name = route.match(/routes(?<name>\/.+)\..+/)?.groups?.name;

		// Index Route
		if (name.endsWith('index')) {
			name = name.match(/(.+)\/index/)?.[1] ?? '';
		}

		// Route Parameters
		const params = name.match(/\[.+?\]/g);

		if (params !== null) {
			for (const param of params) {
				name = name.replace(param, ':' + param.match(/[^\[\]]+/));
			}
		}

		// Import Method
		const { default: method } = await import(route);

		if (typeof method !== 'function') continue;

		// Bind Route
		app.all(name, method);
	}

	// Public Files
	app.use(express.static(path.resolve(__dirname, '..', 'public')));

	// 404
	app.use((_req, res) => res.redirect('index'));

	// Listen
	app.listen(port, () => {
		console.log('Server running at', ('http://localhost:' + port).cyan);
		console.log(`\u2728  Up in ${Date.now() - time}ms.`.green);
	});

	// Handle Exit
	['SIGINT', 'SIGTERM', 'SIGUSR2'].map(signal => {
		process.addListener(signal, () => process.exit());
	});
}
main();
