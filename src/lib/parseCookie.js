/**
 * Parse a cookie string into an object.
 * @param {string} cookie The cookie string to parse.
 * @returns {Record<string, string>} The resulting object.
 */
function parseCookie(cookie) {
	return cookie.split(/; */).map(s => s.split(/=(.*)/)).reduce((o, s) => ({ ...o, [s[0]]: s[1] }), {});
}

// Export
module.exports = parseCookie;
