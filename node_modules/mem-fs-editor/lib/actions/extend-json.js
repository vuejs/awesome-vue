'use strict';

var extend = require('deep-extend');

module.exports = function (filepath, contents, replacer, space) {
  var originalContent = this.readJSON(filepath, {});
  var newContent = extend({}, originalContent, contents);

  this.writeJSON(filepath, newContent, replacer, space);
};
