// Import
const { Sequelize } = require('sequelize');

// Initialise
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	dialect: 'mysql',

	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT ?? '3306'),

	define: {
		underscored: true,
		freezeTableName: true,
		timestamps: false
	},
	logging: null
});

// Export
module.exports = sequelize;
