'use strict';

module.exports = function (from, to, options) {
  this.copy(from, to, options);
  this.delete(from, options);
};
