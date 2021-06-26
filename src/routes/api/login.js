// Import
const passport = require('passport');

// Export Route
module.exports = (req, res) => passport.authenticate('local')(req, res, () => res.end());
