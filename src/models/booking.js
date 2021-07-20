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
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	},
	user_id: {
		type: DataTypes.INTEGER,
		defaultValue: null
	},
	startTime: {
		type: DataTypes.DATE,
		allowNull: false
	},
	endTime: {
		type: DataTypes.DATE,
		allowNull: false
	}
});

// Export
module.exports = Booking;
