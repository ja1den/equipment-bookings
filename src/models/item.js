// Import
const { DataTypes } = require('sequelize');

// Lib
const sequelize = require('../lib/sequelize');

// Define Model
const Item = sequelize.define('item', {
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
	category: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	stock: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	hidden: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
});

// Export
module.exports = Item;
