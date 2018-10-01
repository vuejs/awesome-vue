'use strict';

var DEFAULT_INDENTATION = 2;

module.exports = function (filepath, contents, replacer, space) {
  var jsonStr = JSON.stringify(contents, replacer || null, space || DEFAULT_INDENTATION) + '\n';

  return this.write(filepath, jsonStr);
};
