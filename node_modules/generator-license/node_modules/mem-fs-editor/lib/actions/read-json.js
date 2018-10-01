'use strict';

module.exports = function (filepath, defaults) {
  if (this.exists(filepath)) {
    try {
      return JSON.parse(this.read(filepath));
    } catch (error) {
      throw new Error('Could not parse JSON in file: ' + filepath + '. Detail: ' + error.message);
    }
  } else {
    return defaults;
  }
};
