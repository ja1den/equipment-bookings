// Import
const { DataTypes } = require('sequelize');

// Lib
const sequelize = require('../lib/sequelize');

// Define Model
const Booking = sequelize.define('booking', {
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
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			is: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		},
	},
	user_id: {
		type: DataTypes.INTEGER,
		defaultValue: null,
	},
	comment: {
		type: DataTypes.STRING,
		defaultValue: null,
	},
	start_date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	end_date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
});

// Export
module.exports = Booking;
