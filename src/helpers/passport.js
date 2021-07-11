// Import
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

// Lib
const models = require('../models');

// Serialization
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	models.user.read(id)
		.then(user => done(null, user))
		.catch(done);
});

// Handle Login
const handleLogin = (email, password, done) => models.user.login(email, password)
	.then(user => done(null, user)).catch(done);

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, handleLogin));

// Export
module.exports = passport;
