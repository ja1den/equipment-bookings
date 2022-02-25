// Import
const { DataTypes } = require('sequelize');

// Lib
const sequelize = require('../lib/sequelize');

// Define Model
const User = sequelize.define('user', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		unique: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			is: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	global: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
	hidden: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
});

// Export
module.exports = User;
