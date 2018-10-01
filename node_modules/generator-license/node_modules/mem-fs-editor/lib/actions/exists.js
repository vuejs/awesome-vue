'use strict';

module.exports = function (filepath) {
  var file = this.store.get(filepath);

  return file.contents !== null && file.state !== 'deleted';
};
