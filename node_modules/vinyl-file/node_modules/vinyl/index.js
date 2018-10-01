var path = require('path');
var clone = require('clone');
var cloneStats = require('clone-stats');
var cloneBuffer = require('./lib/cloneBuffer');
var isBuffer = require('./lib/isBuffer');
var isStream = require('./lib/isStream');
var isNull = require('./lib/isNull');
var inspectStream = require('./lib/inspectStream');
var Stream = require('stream');
var replaceExt = require('replace-ext');

var builtInFields = [
  '_contents', 'contents', 'stat', 'history', 'path', 'base', 'cwd',
];

function File(file) {
  var self = this;

  if (!file) {
    file = {};
  }

  // Record path change
  var history = file.path ? [file.path] : file.history;
  this.history = history || [];

  this.cwd = file.cwd || process.cwd();
  this.base = file.base || this.cwd;

  // Stat = files stats object
  this.stat = file.stat || null;

  // Contents = stream, buffer, or null if not read
  this.contents = file.contents || null;

  this._isVinyl = true;

  // Set custom properties
  Object.keys(file).forEach(function(key) {
    if (self.constructor.isCustomProp(key)) {
      self[key] = file[key];
    }
  });
}

File.prototype.isBuffer = function() {
  return isBuffer(this.contents);
};

File.prototype.isStream = function() {
  return isStream(this.contents);
};

File.prototype.isNull = function() {
  return isNull(this.contents);
};

// TODO: Should this be moved to vinyl-fs?
File.prototype.isDirectory = function() {
  return this.isNull() && this.stat && this.stat.isDirectory();
};

File.prototype.clone = function(opt) {
  var self = this;

  if (typeof opt === 'boolean') {
    opt = {
      deep: opt,
      contents: true,
    };
  } else if (!opt) {
    opt = {
      deep: true,
      contents: true,
    };
  } else {
    opt.deep = opt.deep === true;
    opt.contents = opt.contents !== false;
  }

  // Clone our file contents
  var contents;
  if (this.isStream()) {
    contents = this.contents.pipe(new Stream.PassThrough());
    this.contents = this.contents.pipe(new Stream.PassThrough());
  } else if (this.isBuffer()) {
    contents = opt.contents ? cloneBuffer(this.contents) : this.contents;
  }

  var file = new this.constructor({
    cwd: this.cwd,
    base: this.base,
    stat: (this.stat ? cloneStats(this.stat) : null),
    history: this.history.slice(),
    contents: contents,
  });

  // Clone our custom properties
  Object.keys(this).forEach(function(key) {
    if (self.constructor.isCustomProp(key)) {
      file[key] = opt.deep ? clone(self[key], true) : self[key];
    }
  });
  return file;
};

File.prototype.pipe = function(stream, opt) {
  if (!opt) {
    opt = {};
  }
  if (typeof opt.end === 'undefined') {
    opt.end = true;
  }

  if (this.isStream()) {
    return this.contents.pipe(stream, opt);
  }
  if (this.isBuffer()) {
    if (opt.end) {
      stream.end(this.contents);
    } else {
      stream.write(this.contents);
    }
    return stream;
  }

  // Check if isNull
  if (opt.end) {
    stream.end();
  }
  return stream;
};

File.prototype.inspect = function() {
  var inspect = [];

  // Use relative path if possible
  var filePath = (this.base && this.path) ? this.relative : this.path;

  if (filePath) {
    inspect.push('"' + filePath + '"');
  }

  if (this.isBuffer()) {
    inspect.push(this.contents.inspect());
  }

  if (this.isStream()) {
    inspect.push(inspectStream(this.contents));
  }

  return '<File ' + inspect.join(' ') + '>';
};

File.isCustomProp = function(key) {
  return builtInFields.indexOf(key) === -1;
};

File.isVinyl = function(file) {
  return (file && file._isVinyl === true) || false;
};

// Virtual attributes
// Or stuff with extra logic
Object.defineProperty(File.prototype, 'contents', {
  get: function() {
    return this._contents;
  },
  set: function(val) {
    if (!isBuffer(val) && !isStream(val) && !isNull(val)) {
      throw new Error('File.contents can only be a Buffer, a Stream, or null.');
    }
    this._contents = val;
  },
});

// TODO: Should this be moved to vinyl-fs?
Object.defineProperty(File.prototype, 'relative', {
  get: function() {
    if (!this.base) {
      throw new Error('No base specified! Can not get relative.');
    }
    if (!this.path) {
      throw new Error('No path specified! Can not get relative.');
    }
    return path.relative(this.base, this.path);
  },
  set: function() {
    throw new Error('File.relative is generated from the base and path attributes. Do not modify it.');
  },
});

Object.defineProperty(File.prototype, 'dirname', {
  get: function() {
    if (!this.path) {
      throw new Error('No path specified! Can not get dirname.');
    }
    return path.dirname(this.path);
  },
  set: function(dirname) {
    if (!this.path) {
      throw new Error('No path specified! Can not set dirname.');
    }
    this.path = path.join(dirname, path.basename(this.path));
  },
});

Object.defineProperty(File.prototype, 'basename', {
  get: function() {
    if (!this.path) {
      throw new Error('No path specified! Can not get basename.');
    }
    return path.basename(this.path);
  },
  set: function(basename) {
    if (!this.path) {
      throw new Error('No path specified! Can not set basename.');
    }
    this.path = path.join(path.dirname(this.path), basename);
  },
});

// Property for getting/setting stem of the filename.
Object.defineProperty(File.prototype, 'stem', {
  get: function() {
    if (!this.path) {
      throw new Error('No path specified! Can not get stem.');
    }
    return path.basename(this.path, this.extname);
  },
  set: function(stem) {
    if (!this.path) {
      throw new Error('No path specified! Can not set stem.');
    }
    this.path = path.join(path.dirname(this.path), stem + this.extname);
  },
});

Object.defineProperty(File.prototype, 'extname', {
  get: function() {
    if (!this.path) {
      throw new Error('No path specified! Can not get extname.');
    }
    return path.extname(this.path);
  },
  set: function(extname) {
    if (!this.path) {
      throw new Error('No path specified! Can not set extname.');
    }
    this.path = replaceExt(this.path, extname);
  },
});

Object.defineProperty(File.prototype, 'path', {
  get: function() {
    return this.history[this.history.length - 1];
  },
  set: function(path) {
    if (typeof path !== 'string') {
      throw new Error('path should be string');
    }

    // Record history only when path changed
    if (path && path !== this.path) {
      this.history.push(path);
    }
  },
});

module.exports = File;
