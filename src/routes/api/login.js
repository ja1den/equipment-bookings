// Export Route
module.exports = (req, res) => (require('passport')).authenticate('local')(req, res, () => res.end());
