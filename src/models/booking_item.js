// Import
const { DataTypes } = require('sequelize');

// Lib
const sequelize = require('../lib/sequelize');

// Define Model
const BookingItem = sequelize.define('booking_item', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		unique: true,
		autoIncrement: true,
	},
	booking_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	item_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

// Export
module.exports = BookingItem;
