var fs = require('fs');
var path = require('path');
var alloc = require('buffer-alloc');
var MAX_BYTES = 512;

module.exports = function(bytes, size, cb) {
  // Only two args
  if (cb === undefined) {
    var file = bytes;
    cb = size;

    fs.stat(file, function(err, stat) {
      if (err || !stat.isFile()) return cb(err, false);

      fs.open(file, 'r', function(r_err, descriptor){
          if (r_err) return cb(r_err);
          bytes = alloc(MAX_BYTES);
          // Read the file with no encoding for raw buffer access.
          fs.read(descriptor, bytes, 0, bytes.length, 0, function(err, size, bytes){
            fs.close(descriptor, function(c_err){
                if (c_err) return cb(c_err, false);
                return cb(null, isBinaryCheck(bytes, size));
            });
          });
      });
    });
  }
  else
    return cb(null, isBinaryCheck(bytes, size));
};

function isBinaryCheck(bytes, size) {
  if (size === 0)
    return false;

  var suspicious_bytes = 0;
  var total_bytes = Math.min(size, MAX_BYTES);

  // UTF-8 BOM
  if (size >= 3 && bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF) {
    return false;
  }

  // UTF-32 BOM
  if (size >= 4 && bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] == 0xFE && bytes[3] == 0xFF) {
    return false;
  }

  // UTF-32 LE BOM
  if (size >= 4 && bytes[0] == 0xFF && bytes[1] == 0xFE && bytes[2] === 0x00 && bytes[3] === 0x00) {
    return false;
  }

  // GB BOM
  if (size >= 4 && bytes[0] == 0x84 && bytes[1] == 0x31 && bytes[2] == 0x95 && bytes[3] == 0x33) {
    return false;
  }

  if (total_bytes >= 5 && bytes.slice(0, 5) == "%PDF-") {
      /* PDF. This is binary. */
      return true;
  }

  // UTF-16 BE BOM
  if (size >= 2 && bytes[0] == 0xFE && bytes[1] == 0xFF) {
    return false;
  }

  // UTF-16 LE BOM
  if (size >= 2 && bytes[0] == 0xFF && bytes[1] == 0xFE) {
    return false;
  }

  for (var i = 0; i < total_bytes; i++) {
    if (bytes[i] === 0) { // NULL byte--it's binary!
      return true;
    }
    else if ((bytes[i] < 7 || bytes[i] > 14) && (bytes[i] < 32 || bytes[i] > 127)) {
      // UTF-8 detection
      if (bytes[i] > 193 && bytes[i] < 224 && i + 1 < total_bytes) {
          i++;
          if (bytes[i] > 127 && bytes[i] < 192) {
            continue;
          }
      }
      else if (bytes[i] > 223 && bytes[i] < 240 && i + 2 < total_bytes) {
          i++;
          if (bytes[i] > 127 && bytes[i] < 192 && bytes[i + 1] > 127 && bytes[i + 1] < 192) {
            i++;
            continue;
          }
      }
      suspicious_bytes++;
      // Read at least 32 bytes before making a decision
      if (i > 32 && (suspicious_bytes * 100) / total_bytes > 10) {
        return true;
      }
    }
  }

  if ((suspicious_bytes * 100) / total_bytes > 10) {
    return true;
  }

  return false;
}

module.exports.sync = function(bytes, size) {
  // Only one arg
  if (size === undefined) {
    var file = bytes;
    try {
      if(!fs.statSync(file).isFile()) return false;
    } catch (err) {
      // otherwise continue on
    }
    var descriptor = fs.openSync(file, 'r');
    try {
      // Read the file with no encoding for raw buffer access.
      bytes = alloc(MAX_BYTES);
      size = fs.readSync(descriptor, bytes, 0, bytes.length, 0);
    } finally {
      fs.closeSync(descriptor);
    }
    return isBinaryCheck(bytes, size);
  }
  else
    return isBinaryCheck(bytes, size);
}
