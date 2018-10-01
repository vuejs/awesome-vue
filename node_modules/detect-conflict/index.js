'use strict';
var path = require('path');
var fs = require('fs');

/**
 * Check if the file contents at `filepath` conflict with the `contents` passed to the
 * function
 *
 * If `filepath` points to a folder, we'll always return true.
 *
 * @param  {String} filepath Destination filepath (current with to compare with)
 * @param  {Buffer|String} contents The new content to compare with. If passed as a
 *                                  string, we assume it is utf8 encoded.
 * @return {Boolean} `true` if there's a conflict, `false` otherwise.
 */
module.exports = function (filepath, contents) {
  filepath = path.resolve(filepath);

  // If file is new, then it's safe to process
  if (!fs.existsSync(filepath)) return false;

  // If file path point to a directory, then it's not safe to write
  if (fs.statSync(filepath).isDirectory()) return true;

  var actual = fs.readFileSync(path.resolve(filepath));

  if (!(contents instanceof Buffer)) {
    contents = new Buffer(contents || '', 'utf8');
  }

  // We convert each Buffer contents to an hexadecimal string first, and then compare
  // them with standard `===`. This trick allow to compare binary files contents.
  return actual.toString('hex') !== contents.toString('hex')
};
