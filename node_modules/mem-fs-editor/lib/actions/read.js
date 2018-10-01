'use strict';

module.exports = function (filepath, options) {
  options = options || {raw: false};
  var file = this.store.get(filepath);

  if (file.state === 'deleted' || file.contents === null) {
    if ('defaults' in options) {
      return options.defaults;
    }

    throw new Error(filepath + ' doesn\'t exist');
  }

  return options.raw ? file.contents : file.contents.toString();
};
