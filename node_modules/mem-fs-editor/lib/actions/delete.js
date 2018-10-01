'use strict';

var path = require('path');
var globby = require('globby');
var multimatch = require('multimatch');
var util = require('../util');

function deleteFile(path, store) {
  var file = store.get(path);
  file.state = 'deleted';
  file.contents = null;
  store.add(file);
}

module.exports = function (paths, options) {
  if (!Array.isArray(paths)) {
    paths = [paths];
  }
  paths = paths.map(function (filePath) {
    return path.resolve(filePath);
  });
  paths = util.globify(paths);
  options = options || {};

  var globOptions = options.globOptions || {};
  var files = globby.sync(paths, globOptions);
  files.forEach(function (file) {
    deleteFile(file, this.store);
  }.bind(this));

  this.store.each(function (file) {
    if (multimatch([file.path], paths).length !== 0) {
      deleteFile(file.path, this.store);
    }
  }.bind(this));
};
