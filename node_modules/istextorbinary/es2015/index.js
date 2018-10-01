/* eslint no-use-before-define:0 */
'use strict';

// Import

var pathUtil = require('path');
var textExtensions = require('textextensions');
var binaryExtensions = require('binaryextensions');

/**
 * Is Text (Synchronous)
 * Determine whether or not a file is a text or binary file.
 * Determined by extension checks first, then if unknown extension, will fallback on encoding detection.
 * We do that as encoding detection cannot guarantee everything, especially for chars between utf8 and utf16
 * @param {?string} filename - the filename for the file/buffer if available
 * @param {?Buffer} buffer - the buffer for the file if available
 * @returns {Error|boolean}
 */
function isTextSync(filename, buffer) {
	// Prepare
	var isText = null;

	// Test extensions
	if (filename) {
		// Extract filename
		var parts = pathUtil.basename(filename).split('.').reverse();

		// Cycle extensions
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var extension = _step.value;

				if (textExtensions.indexOf(extension) !== -1) {
					isText = true;
					break;
				}
				if (binaryExtensions.indexOf(extension) !== -1) {
					isText = false;
					break;
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}

	// Fallback to encoding if extension check was not enough
	if (buffer && isText === null) {
		isText = getEncodingSync(buffer) === 'utf8';
	}

	// Return our result
	return isText;
}

/**
 * Is Text
 * Uses `isTextSync` behind the scenes.
 * @param {?string} filename - forwarded to `isTextSync`
 * @param {?Buffer} buffer - forwarded to `isTextSync`
 * @param {Function} next - accepts arguments: (error: Error, result: Boolean)
 * @returns {nothing}
 */
function isText(filename, buffer, next) {
	var result = isTextSync(filename, buffer);
	if (result instanceof Error) {
		next(result);
	} else {
		next(null, result);
	}
}

/**
 * Is Binary (Synchronous)
 * Uses `isTextSync` behind the scenes.
 * @param {?string} filename - forwarded to `isTextSync`
 * @param {?Buffer} buffer - forwarded to `isTextSync`
 * @returns {Error|boolean}
 */
function isBinarySync(filename, buffer) {
	// Handle
	var result = isTextSync(filename, buffer);
	return result instanceof Error ? result : !result;
}

/**
 * Is Binary
 * Uses `isText` behind the scenes.
 * @param {?string} filename - forwarded to `isText`
 * @param {?Buffer} buffer - forwarded to `isText`
 * @param {Function} next - accepts arguments: (error: Error, result: Boolean)
 * @returns {nothing}
 */
function isBinary(filename, buffer, next) {
	// Handle
	isText(filename, buffer, function (err, result) {
		if (err) return next(err);
		return next(null, !result);
	});
}

/**
 * Get the encoding of a buffer.
 * We fetch a bunch chars from the start, middle and end of the buffer.
 * We check all three, as doing only start was not enough, and doing only middle was not enough, so better safe than sorry.
 * @param {Buffer} buffer
 * @param {?Object} [opts]
 * @param {?number} [opts.chunkLength = 24]
 * @param {?number} [opts.chunkBegin = 0]
 * @returns {Error|string} either an Error instance if something went wrong, or if successful "utf8" or "binary"
 */
function getEncodingSync(buffer, opts) {
	// Prepare
	var textEncoding = 'utf8';
	var binaryEncoding = 'binary';

	// Discover
	if (opts == null) {
		// Start
		var chunkLength = 24;
		var encoding = getEncodingSync(buffer, { chunkLength: chunkLength });
		if (encoding === textEncoding) {
			// Middle
			var chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength);
			encoding = getEncodingSync(buffer, { chunkLength: chunkLength, chunkBegin: chunkBegin });
			if (encoding === textEncoding) {
				// End
				chunkBegin = Math.max(0, buffer.length - chunkLength);
				encoding = getEncodingSync(buffer, { chunkLength: chunkLength, chunkBegin: chunkBegin });
			}
		}

		// Return
		return encoding;
	} else {
		// Extract
		var _opts$chunkLength = opts.chunkLength,
		    _chunkLength = _opts$chunkLength === undefined ? 24 : _opts$chunkLength,
		    _opts$chunkBegin = opts.chunkBegin,
		    _chunkBegin = _opts$chunkBegin === undefined ? 0 : _opts$chunkBegin;

		var chunkEnd = Math.min(buffer.length, _chunkBegin + _chunkLength);
		var contentChunkUTF8 = buffer.toString(textEncoding, _chunkBegin, chunkEnd);
		var _encoding = textEncoding;

		// Detect encoding
		for (var i = 0; i < contentChunkUTF8.length; ++i) {
			var charCode = contentChunkUTF8.charCodeAt(i);
			if (charCode === 65533 || charCode <= 8) {
				// 8 and below are control characters (e.g. backspace, null, eof, etc.)
				// 65533 is the unknown character
				// console.log(charCode, contentChunkUTF8[i])
				_encoding = binaryEncoding;
				break;
			}
		}

		// Return
		return _encoding;
	}
}

/**
 * Get the encoding of a buffer
 * Uses `getEncodingSync` behind the scenes.
 * @param {Buffer} buffer - forwarded to `getEncodingSync`
 * @param {Object} opts - forwarded to `getEncodingSync`
 * @param {Function} next - accepts arguments: (error: Error, result: Boolean)
 * @returns {nothing}
 */
function getEncoding(buffer, opts, next) {
	// Fetch and wrap result
	var result = getEncodingSync(buffer, opts);
	if (result instanceof Error) {
		next(result);
	} else {
		next(null, result);
	}
}

// Export
module.exports = { isTextSync: isTextSync, isText: isText, isBinarySync: isBinarySync, isBinary: isBinary, getEncodingSync: getEncodingSync, getEncoding: getEncoding };