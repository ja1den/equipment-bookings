// Import
const Booking = require('./booking');
const BookingItem = require('./booking_item');
const Item = require('./item');
const User = require('./user');

// Define Associations
Booking.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Booking, { foreignKey: 'user_id' });

Booking.belongsToMany(Item, { through: BookingItem, foreignKey: { name: 'booking_id', allowNull: false } });
Item.belongsToMany(Booking, { through: BookingItem, foreignKey: { name: 'item_id', allowNull: false } });

BookingItem.belongsTo(Booking, { foreignKey: { name: 'booking_id', allowNull: false } });
Booking.hasMany(BookingItem, { foreignKey: { name: 'booking_id', allowNull: false } });

BookingItem.belongsTo(Item, { foreignKey: { name: 'item_id', allowNull: false } });
Item.hasMany(BookingItem, { foreignKey: { name: 'item_id', allowNull: false } });
