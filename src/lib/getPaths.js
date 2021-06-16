// Import
const path = require('path');
const fs = require('fs');

/**
 * List all the paths in a directory, excluding subdirectories.
 * @param {string} dir - The directory to scan.
 * @param {boolean} recursive - Include subdirectories in the scan.
 * @returns {string[]} The paths in the target directory.
 */
function getPaths(dir, recursive = true) {
	const dirents = fs.readdirSync(dir, { withFileTypes: true });

	let paths = dirents.map(dirent =>
		dirent.isDirectory()
			? recursive
				? getPaths(path.resolve(dir, dirent.name))
				: null
			: path.resolve(dir, dirent.name)
	);

	return paths.filter(i => i !== null).flat();
}

// Export
module.exports = getPaths;
