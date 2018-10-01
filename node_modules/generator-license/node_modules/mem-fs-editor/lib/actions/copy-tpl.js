'use strict';

var extend = require('deep-extend');
var ejs = require('ejs');
var isBinaryFile = require('isbinaryfile');

function render(contents, filename, context, tplSettings) {
  let result;

  const contentsBuffer = Buffer.from(contents, 'binary');
  if (isBinaryFile.sync(contentsBuffer, contentsBuffer.length)) {
    result = contentsBuffer;
  } else {
    result = ejs.render(
      contents.toString(),
      context,
      // Setting filename by default allow including partials.
      extend({filename: filename}, tplSettings)
    );
  }

  return result;
}

module.exports = function (from, to, context, tplSettings, options) {
  context = context || {};
  tplSettings = tplSettings || {}

  this.copy(from, to, extend(options || {}, {
    process: function (contents, filename) {
      return render(contents, filename, context, tplSettings);
    }
  }),
  context, tplSettings);
};
