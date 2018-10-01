'use strict';
var events = require('events');
var path = require('path');
var util = require('util');
var vinylFile = require('vinyl-file');
var File = require('vinyl');
var through = require('through2');

exports.create = function () {
  var store = {};

  function load(filepath) {
    var file;
    try {
      file = vinylFile.readSync(filepath);
    } catch (err) {
      file = new File({
        cwd: process.cwd(),
        base: process.cwd(),
        path: filepath,
        contents: null
      });
    }
    store[filepath] = file;
    return file;
  }

  var Store = function () {
    events.EventEmitter.apply(this, arguments);
  };
  util.inherits(Store, events.EventEmitter);

  Store.prototype.get = function (filepath) {
    filepath = path.resolve(filepath);
    return store[filepath] || load(filepath);
  };

  Store.prototype.add = function (file) {
    store[file.path] = file;
    this.emit('change');
    return this;
  };

  Store.prototype.each = function (onEach) {
    Object.keys(store).forEach(function (key, index) {
      onEach(store[key], index);
    });
    return this;
  };

  Store.prototype.stream = function () {
    var stream = through.obj();
    setImmediate(function () {
      this.each(stream.write.bind(stream));
      stream.end();
    }.bind(this));
    return stream;
  };

  return new Store();
};
