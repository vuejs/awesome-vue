/* eslint no-use-before-define:0 */
'use strict'

// Import
const pathUtil = require('path')
const textExtensions = require('textextensions')
const binaryExtensions = require('binaryextensions')

/**
 * Is Text (Synchronous)
 * Determine whether or not a file is a text or binary file.
 * Determined by extension checks first, then if unknown extension, will fallback on encoding detection.
 * We do that as encoding detection cannot guarantee everything, especially for chars between utf8 and utf16
 * @param {?string} filename - the filename for the file/buffer if available
 * @param {?Buffer} buffer - the buffer for the file if available
 * @returns {Error|boolean}
 */
function isTextSync (filename, buffer) {
	// Prepare
	let isText = null

	// Test extensions
	if (filename) {
		// Extract filename
		const parts = pathUtil.basename(filename).split('.').reverse()

		// Cycle extensions
		for (const extension of parts) {
			if (textExtensions.indexOf(extension) !== -1) {
				isText = true
				break
			}
			if (binaryExtensions.indexOf(extension) !== -1) {
				isText = false
				break
			}
		}
	}

	// Fallback to encoding if extension check was not enough
	if (buffer && isText === null) {
		isText = getEncodingSync(buffer) === 'utf8'
	}

	// Return our result
	return isText
}

/**
 * Is Text
 * Uses `isTextSync` behind the scenes.
 * @param {?string} filename - forwarded to `isTextSync`
 * @param {?Buffer} buffer - forwarded to `isTextSync`
 * @param {Function} next - accepts arguments: (error: Error, result: Boolean)
 * @returns {nothing}
 */
function isText (filename, buffer, next) {
	const result = isTextSync(filename, buffer)
	if (result instanceof Error) {
		next(result)
	}
	else {
		next(null, result)
	}
}

/**
 * Is Binary (Synchronous)
 * Uses `isTextSync` behind the scenes.
 * @param {?string} filename - forwarded to `isTextSync`
 * @param {?Buffer} buffer - forwarded to `isTextSync`
 * @returns {Error|boolean}
 */
function isBinarySync (filename, buffer) {
	// Handle
	const result = isTextSync(filename, buffer)
	return result instanceof Error ? result : !result
}

/**
 * Is Binary
 * Uses `isText` behind the scenes.
 * @param {?string} filename - forwarded to `isText`
 * @param {?Buffer} buffer - forwarded to `isText`
 * @param {Function} next - accepts arguments: (error: Error, result: Boolean)
 * @returns {nothing}
 */
function isBinary (filename, buffer, next) {
	// Handle
	isText(filename, buffer, function (err, result) {
		if (err) return next(err)
		return next(null, !result)
	})
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
function getEncodingSync (buffer, opts) {
	// Prepare
	const textEncoding = 'utf8'
	const binaryEncoding = 'binary'

	// Discover
	if (opts == null) {
		// Start
		const chunkLength = 24
		let encoding = getEncodingSync(buffer, { chunkLength })
		if (encoding === textEncoding) {
			// Middle
			let chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength)
			encoding = getEncodingSync(buffer, { chunkLength, chunkBegin })
			if (encoding === textEncoding) {
				// End
				chunkBegin = Math.max(0, buffer.length - chunkLength)
				encoding = getEncodingSync(buffer, { chunkLength, chunkBegin })
			}
		}

		// Return
		return encoding
	}
	else {
		// Extract
		const { chunkLength = 24, chunkBegin = 0 } = opts
		const chunkEnd = Math.min(buffer.length, chunkBegin + chunkLength)
		const contentChunkUTF8 = buffer.toString(textEncoding, chunkBegin, chunkEnd)
		let encoding = textEncoding

		// Detect encoding
		for (let i = 0; i < contentChunkUTF8.length; ++i) {
			const charCode = contentChunkUTF8.charCodeAt(i)
			if (charCode === 65533 || charCode <= 8) {
				// 8 and below are control characters (e.g. backspace, null, eof, etc.)
				// 65533 is the unknown character
				// console.log(charCode, contentChunkUTF8[i])
				encoding = binaryEncoding
				break
			}
		}

		// Return
		return encoding
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
function getEncoding (buffer, opts, next) {
	// Fetch and wrap result
	const result = getEncodingSync(buffer, opts)
	if (result instanceof Error) {
		next(result)
	}
	else {
		next(null, result)
	}
}

// Export
module.exports = { isTextSync, isText, isBinarySync, isBinary, getEncodingSync, getEncoding }
