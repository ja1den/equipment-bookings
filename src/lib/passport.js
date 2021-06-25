// Import
const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

// Lib
const mysql = require('./mysql');

// Serialization
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	mysql.query('SELECT * FROM user WHERE user.id = ?', [id])
		.then(res => done(null, res[0][0]))
		.catch(done);
});

// Local Strategy
passport.use(new LocalStrategy(
	async (email, password, done) => {
		// Handle Username
		const user = await mysql.query('SELECT * FROM user WHERE user.email = ?', [email]).then(res => res[0][0]).catch(done);

		if (!user) return done(null, false, { message: 'Incorrect username.' });

		// Handle Password
		const same = await bcrypt.compare(password, user.password).catch(done);

		if (!same) return done(null, false, { message: 'Incorrect password.' });

		// Success
		return done(null, user);
	}
));

// Export
module.exports = passport;
