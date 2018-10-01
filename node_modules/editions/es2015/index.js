/* @flow */
/* eslint no-console:0 */
'use strict';

// Imports

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pathUtil = require('path');

// Helper class to display nested error in a sensible way

var DetailedError = function (_Error) {
	_inherits(DetailedError, _Error);

	function DetailedError(message /* :string */, details /* :Object */) {
		_classCallCheck(this, DetailedError);

		Object.keys(details).forEach(function (key) {
			var data = details[key];
			var value = require('util').inspect(data.stack || data.message || data);
			message += '\n' + key + ': ' + value;
		});
		return _possibleConstructorReturn(this, (DetailedError.__proto__ || Object.getPrototypeOf(DetailedError)).call(this, message));
	}

	return DetailedError;
}(Error);

// Environment fetching


var blacklist = process && process.env && process.env.EDITIONS_SYNTAX_BLACKLIST && process.env.EDITIONS_SYNTAX_BLACKLIST.split(',');

// Cache of which syntax combinations are supported or unsupported, hash of booleans
var syntaxFailedCombitions = {}; // sorted lowercase syntax combination => Error instance of failure
var syntaxBlacklist = {};
syntaxBlacklist.import = new Error('The import syntax is skipped as the module package.json field eliminates the need for autoloader support');
syntaxBlacklist.coffeescript = new Error('The coffeescript syntax is skipped as we want to use a precompiled edition rather than compiling at runtime');
syntaxBlacklist.typescript = new Error('The typescript syntax is skipped as we want to use a precompiled edition rather than compiling at runtime');

// Blacklist non-esnext node versions from esnext
if (process && process.versions && process.versions.node) {
	var EARLIEST_ESNEXT_NODE_VERSION = [0, 12];
	var NODE_VERSION = process.versions.node.split('.').map(function (n) {
		return parseInt(n, 10);
	});
	var ESNEXT_UNSUPPORTED = NODE_VERSION[0] < EARLIEST_ESNEXT_NODE_VERSION[0] || NODE_VERSION[0] === EARLIEST_ESNEXT_NODE_VERSION[0] && NODE_VERSION[1] < EARLIEST_ESNEXT_NODE_VERSION[1];
	if (ESNEXT_UNSUPPORTED) syntaxBlacklist.esnext = new Error('The esnext syntax is skipped on early node versions as attempting to use esnext features will output debugging information on these node versions');
}

// Check the environment configuration for a syntax blacklist
if (blacklist) {
	for (var i = 0; i < blacklist.length; ++i) {
		var syntax = blacklist[i].trim().toLowerCase();
		syntaxBlacklist[syntax] = new DetailedError('The EDITIONS_SYNTAX_BLACKLIST environment variable has blacklisted an edition syntax:', { syntax: syntax, blacklist: blacklist });
	}
}

/* ::
type edition = {
	name:number,
	description?:string,
	directory?:string,
	entry?:string,
	syntaxes?:Array<string>
};
type options = {
	cwd?:string,
	package?:string,
	entry?:string,
	require:function
};
*/

/**
 * Cycle through the editions and require the correct one
 * @protected internal function that is untested for public consumption
 * @param {edition} edition - the edition entry
 * @param {Object} opts - the following options
 * @param {string} opts.require - the require method of the calling module, used to ensure require paths remain correct
 * @param {string} [opts.cwd] - if provided, this will be the cwd for entries
 * @param {string} [opts.entry] - if provided, should be a relative or absolute path to the entry point of the edition
 * @param {string} [opts.package] - if provided, should be the name of the package that we are loading the editions for
 * @returns {*}
 */
function requireEdition(edition /* :edition */, opts /* :options */) /* :any */{
	// Prevent require from being included in debug logs
	Object.defineProperty(opts, 'require', { value: opts.require, enumerable: false });

	// Get the correct entry path
	// As older versions o
	var cwd = opts.cwd || '';
	var dir = edition.directory || '';
	var entry = opts.entry || edition.entry || '';
	if (dir && entry && entry.indexOf(dir + '/') === 0) entry = entry.substring(dir.length + 1);
	// ^ this should not be needed, but as previous versions of editions included the directory inside the entry
	// it unfortunately is, as such this is a stepping stone for the new format, the new format being
	// if entry is specified by itself, it is cwd => entry
	// if entry is specified with a directory, it is cwd => dir => entry
	// if entry is not specified but dir is, it is cwd => dir
	// if neither entry nor dir are specified, we have a problem
	if (!dir && !entry) {
		var editionFailure = new DetailedError('Skipped edition due to no entry or directory being specified:', { edition: edition, cwd: cwd, dir: dir, entry: entry });
		throw editionFailure;
	}
	var entryPath = pathUtil.resolve(cwd, dir, entry);

	// Check syntax support
	// Convert syntaxes into a sorted lowercase string
	var syntaxes = edition.syntaxes && edition.syntaxes.map(function (i) {
		return i.toLowerCase();
	}).sort();
	var syntaxCombination = syntaxes && syntaxes.join(', ');
	if (syntaxes && syntaxCombination) {
		// Check if any of the syntaxes are unsupported
		var unsupportedSyntaxes = syntaxes.filter(function (i) {
			return syntaxBlacklist[i.toLowerCase()];
		});
		if (unsupportedSyntaxes.length) {
			var _editionFailure = new DetailedError('Skipped edition due to it containing an unsupported syntax:', { edition: edition, unsupportedSyntaxes: unsupportedSyntaxes });
			throw _editionFailure;
		}
		// Is this syntax combination unsupported? If so skip it with a soft failure to try the next edition
		else if (syntaxFailedCombitions[syntaxCombination]) {
				var previousCombinationFailure = syntaxFailedCombitions[syntaxCombination];
				var _editionFailure2 = new DetailedError('Skipped edition due to its syntax combinatiom failing previously:', { edition: edition, previousCombinationFailure: previousCombinationFailure });
				throw _editionFailure2;
			}
	}

	// Try and load this syntax combination
	try {
		return opts.require(entryPath);
	} catch (error) {
		// Note the error with more details
		var _editionFailure3 = new DetailedError('Failed to load the edition due to a load error:', { edition: edition, error: error.stack });

		// Blacklist the combination, even if it may have worked before
		// Perhaps in the future note if that if it did work previously, then we should instruct module owners to be more specific with their syntaxes
		if (syntaxCombination) syntaxFailedCombitions[syntaxCombination] = _editionFailure3;

		// Continue to the next edition
		throw _editionFailure3;
	}
}

/**
 * Cycle through the editions and require the correct one
 * @protected internal function that is untested for public consumption
 * @param {Array<edition>} editions - an array of edition entries
 * @param {Object} opts - the following options
 * @param {string} opts.require - the require method of the calling module, used to ensure require paths remain correct
 * @param {string} [opts.cwd] - if provided, this will be the cwd for entries
 * @param {string} [opts.entry] - if provided, should be a relative path to the entry point of the edition
 * @param {string} [opts.package] - if provided, should be the name of the package that we are loading the editions for
 * @returns {*}
 */
function requireEditions(editions /* :Array<edition> */, opts /* :options */) /* :any */{
	// Extract
	if (opts.package == null) opts.package = 'custom runtime package';

	// Check
	if (!editions || editions.length === 0) {
		throw new DetailedError('No editions were specified:', { opts: opts });
	}

	// Note the last error message
	var editionFailures = [];

	// Cycle through the editions
	for (var _i = 0; _i < editions.length; ++_i) {
		var edition = editions[_i];
		try {
			return requireEdition(edition, opts);
		} catch (err) {
			editionFailures.push(err);
		}
	}

	// Through the error as no edition loaded
	throw new DetailedError('There are no suitable editions for this environment:', { opts: opts, editions: editions, failures: editionFailures });
}

/**
 * Cycle through the editions for a package and require the correct one
 * @param {string} cwd - the path of the package, used to load package.json:editions and handle relative edition entry points
 * @param {function} require - the require method of the calling module, used to ensure require paths remain correct
 * @param {string} [entry] - an optional override for the entry of an edition, requires the edition to specify a `directory` property
 * @returns {*}
 */
function requirePackage(cwd /* :string */, require /* :function */, entry /* :: ?:string */) /* :any */{
	// Load the package.json file to fetch `name` for debugging and `editions` for loading
	var packagePath = pathUtil.resolve(cwd, 'package.json');

	var _require = require(packagePath),
	    name = _require.name,
	    editions = _require.editions;

	var opts /* :options */ = { cwd: cwd, require: require };
	if (name) opts.package = name;
	if (entry) opts.entry = entry;
	return requireEditions(editions, opts);
}

// Exports
module.exports = { requireEdition: requireEdition, requireEditions: requireEditions, requirePackage: requirePackage };