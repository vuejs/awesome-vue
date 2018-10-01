'use strict';

var extend = require('deep-extend');
var EOL = require('os').EOL;

module.exports = function (to, contents, options) {
  options = extend({
    trimEnd: true,
    separator: EOL
  }, options || {});

  var currentContents = this.read(to);
  if (options.trimEnd) {
    currentContents = currentContents.replace(/\s+$/, '');
  }

  this.write(to, currentContents + options.separator + contents);
};
