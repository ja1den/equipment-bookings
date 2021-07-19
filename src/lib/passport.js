// Import
const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

// Lib
const sequelize = require('./sequelize');

// Serialization
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	sequelize.models.user.findByPk(id).then(user => done(null, user))
		.catch(done);
});

// Handle Login
const handleLogin = async (email, password, done) => {
	// Email
	const user = await sequelize.models.user.findOne({ where: { email } }).catch(done);

	if (user === null) return done();

	// Password
	if (!(await bcrypt.compare(password, user.password))) return done();

	// Return
	return done(null, user);
};

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, handleLogin));

// Export
module.exports = passport;
