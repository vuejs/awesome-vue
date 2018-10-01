'use strict';

const home = require('os').homedir();

module.exports = str => {
	if (typeof str !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof str}`);
	}

	return home ? str.replace(/^~(?=$|\/|\\)/, home) : str;
};
